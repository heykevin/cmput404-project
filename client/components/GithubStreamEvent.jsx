/*!
 * GitHub Activity Stream - v0.1.4 - 10/7/2015
 * https://github.com/caseyscarborough/github-activity
 *
 * Copyright (c) 2016 Casey Scarborough, Alice Wu
 * MIT License
 * http://opensource.org/licenses/MIT
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {ListGroupItem} from 'react-bootstrap';

export class GithubStreamEvent extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	pluralize(word, number) {
	  if (number !== 1) return word + 's';
	  return word;
	}

	millisecondsToStr(milliseconds) {
		const numberEnding = (number) => {
			return (number > 1)
				? 's ago'
				: ' ago';
		}

		let temp = Math.floor(milliseconds / 1000);

		const years = Math.floor(temp / 31536000);
		if (years)
			return years + ' year' + numberEnding(years);

		const months = Math.floor((temp %= 31536000) / 2592000);
		if (months)
			return months + ' month' + numberEnding(months);

		const days = Math.floor((temp %= 2592000) / 86400);
		if (days)
			return days + ' day' + numberEnding(days);

		const hours = Math.floor((temp %= 86400) / 3600);
		if (hours)
			return 'about ' + hours + ' hour' + numberEnding(hours);

		const minutes = Math.floor((temp %= 3600) / 60);
		if (minutes)
			return minutes + ' minute' + numberEnding(minutes);

		const seconds = temp % 60;
		if (seconds)
			return seconds + ' second' + numberEnding(seconds);

		return 'just now';
	}

	render()
	{
		let data = this.props.event,
			p = data.payload,
			gitEvent = {
				shaLinks: [],
				shaMsgs: []
			},
			icon;

		gitEvent.timeString = this.millisecondsToStr(new Date() - new Date(data.created_at));
		gitEvent.userLink = <GitLink githubLink={true} link={data.actor.login} />;
		data.userGravatar = data.actor.avatar_url;

		gitEvent.repoLink = <GitLink githubLink={true} link={data.repo.name} />;
		gitEvent.userGravatar = <UserGravatar link={data.actor.avatar_url} />;

		// Get the branch name if it exists.
		if (p.ref) {
			if (p.ref.substring(0, 11) === 'refs/heads/') {
				data.branch = p.ref.substring(11);
			} else {
				data.branch = p.ref;
			}
			data.branchLink = data.repo.name + '/tree/' + data.branch;

			gitEvent.branchLink = <GitLink githubLink={true} link={data.branchLink} />
		}

		// Only show the first 6 characters of the SHA of each commit if given.
		if (p.commits) {
			data.shaDiff = p.before + '...' + p.head;
			data.commitLength = p.commits.length;
			gitEvent.commitMessage = <CommitMessage
				repo={data.repo.name}
				shaDiff={data.shaDiff}
				commitLength={data.commitLength}
				length={p.size-2} />;


			p.commits.forEach(function(d, i) {
				if (d.message.length > 66) {
					d.message = d.message.substring(0, 66) + '...';
				}
				if (i < 2) {
				    gitEvent.shaLinks.push(<GitLink githubLink={true} link={data.repo.name + '/commit/' + d.sha} title={d.sha.substring(0, 6)} cssClass="gha-sha"/>);
					gitEvent.shaMsgs.push(d.message);
				} else {
				    // Delete the rest of the commits after the first 2, and then break out of the each loop.
				    p.commits.splice(2, p.size);
				    return false;
				}
			});
		}

		// Get the link if this is an IssueEvent.
		if (p.issue) {
			data.issueTitle = data.repo.name + "#" + p.issue.number;
			data.issueLink = p.issue.html_url
			// <GitLink githubLink={false} link={data.issueLink} title={data.issueTitle} />
			data.issueType = "issue";
			if (p.issue.pull_request) {
				data.issueType = "pull request";
			}

			gitEvent.issueType = data.issueType;
			gitEvent.issueLink = <GitLink githubLink={false} link={data.issueLink} title={data.issueTitle} />;
		}

		// Retrieve the pull request link if this is a PullRequestEvent.
		if (p.pull_request) {
			let pr = p.pull_request;
			gitEvent.pullRequestLink = <GitLink githubLink={false} link={pr.html_url} title={data.repo.name + "#" + pr.number}/>;

			// If this was a merge, set the merge message.
			if (p.pull_request.merged) {
				p.action = "merged";
				gitEvent.mergeMessage = <MergeMessage a={pr.additions} c={pr.commits} d={pr.deletions}/>;
			}
		}

		// Get the link if this is a PullRequestReviewCommentEvent
		if (p.comment && p.comment.pull_request_url) {
			data.pullRequestReviewCommentTitle = data.repo.name + "#" + p.comment.pull_request_url.split('/').pop();
			data.pullRequestLink = p.comment.pull_request_url;
			gitEvent.pullRequestLink = <GitLink github={true} link={data.pullRequestLink} title={data.pullRequestReviewCommentTitle} />;
		}

		// Get the comment if one exists, and trim it to 150 characters.
		if (p.comment && p.comment.body) {
			data.comment = p.comment.body;

			gitEvent.comment = data.comment.length > 150 ? data.comment.substring(0, 150) + '...' : data.comment;

			if (p.comment.html_url && p.comment.commit_id) {
				data.commentTitle = data.repo.name + '@' + p.comment.commit_id.substring(0, 10);
				data.commentLink = p.comment.html_url;
				gitEvent.commentLink = <GitLink githubLink={false} link={data.commentLink} title={data.commentTitle} />;
			}
		}

		if (data.type === 'ReleaseEvent') {
			gitEvent.tagLink = <GitLink githubLink={false} link={p.release.html_url} title={p.release.tag_name} />;
			gitEvent.zipLink = <GitLink githubLink={false} link={p.release.zipball_url} title="Download Source Code (zip)" />;
		}

		// Wiki event
		if (data.type === 'GollumEvent') {
			let page = p.pages[0];
			gitEvent.actionType = page.action;

			gitEvent.message = gitEvent.actionType.charAt(0).toUpperCase() + gitEvent.actionType.slice(1) + ' ';
			gitEvent.messageLink = <GitLink githubLink={true} link={page.html_url} title={page.title}/>;
		}

		if (data.type === 'FollowEvent')
			gitEvent.targetLink = <GitLink githublink={true} link={p.target.login} />;
		if (data.type === 'ForkEvent')
			gitEvent.forkLink = <GitLink githublink={true} link={p.forkee.full_name} />;
		if (data.type === 'MemberEvent')
			gitEvent.memberLink = <GitLink githublink={true} link={p.memeber.login} />;

		if (p.gist) {
			gitEvent.actionType = p.action === 'fork'
				? p.action + 'ed'
				: p.action + 'd';
			gitEvent.gistLink = <GitLink githublink={false} link={p.gist.html_url} title={'gist: ' + p.gist.id}/>;
		}

		if (data.type == 'CreateEvent' && (['repository', 'branch', 'tag'].indexOf(p.ref_type) >= 0)) {
			// Display separate icons depending on type of create event.
			icon = icons[data.type + '_' + p.ref_type];
		} else {
			icon = icons[data.type]
		}

		icon = "octicon octicon-" + icon;
		switch (data.type) {
			case "CommitCommentEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} commented on commit {gitEvent.commentLink}<br/>
									{gitEvent.userGravatar}
									<small>{gitEvent.comment}</small>
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
				break;
			case "CreateEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} created {p.ref_type} {gitEvent.branchLink} {gitEvent.repoLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "DeleteEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} deleted {p.ref_type}  {p.ref} at {gitEvent.repoLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "FollowEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} started following {gitEvent.targetLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "ForkEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} forked {gitEvent.repoLink} to {gitEvent.forkLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "GistEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} {gitEvent.actionType} {gitEvent.gistLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "GollumEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} {gitEvent.actionType} the {gitEvent.repoLink} wiki<br/>
									{gitEvent.userGravatar}
									<small>{gitEvent.message}</small>
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "IssueCommentEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} commented on {gitEvent.issueType} {gitEvent.issueLink}<br/>{gitEvent.userGravatar}<small>{gitEvent.comment}</small>
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "IssuesEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
							<div className="gha-activity-icon"><span className={icon}></span></div>
							<div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} {p.action} issue {gitEvent.issueLink}<br/>{gitEvent.userGravatar}<small>{p.issue.title}</small>
							</div>
							<div className="gha-clear"></div>
						 </div>
					</ListGroupItem>
				);
			case "MemberEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} added {gitEvent.memberLink} to {gitEvent.repoLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "PublicEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} open sourced {gitEvent.repoLink}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "PullRequestEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} {p.action} pull request {gitEvent.pullRequestLink}<br/>{gitEvent.userGravatar}<small>{p.pull_request.title}</small>{gitEvent.mergeMessage}
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "PullRequestReviewCommentEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} commented on pull request {gitEvent.pullRequestLink}<br/>{gitEvent.userGravatar}<small>{gitEvent.comment}</small>
							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "PushEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} pushed to {gitEvent.branchLink} {gitEvent.repoLink} <br/>
									<ul className="gha-commits">
										<li>{gitEvent.shaLinks[0]} <small>{gitEvent.shaMsgs[0]}</small></li>
									</ul>

							</div>
			                <div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "ReleaseEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} released {gitEvent.targetLink} at {gitEvent.repoLink}<br/>
									{gitEvent.userGravatar}<small><span className="octicon octicon-cloud-download"></span>  {gitEvent.zipLink}</small>
							</div>
							<div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);
			case "WatchEvent":
				return (
					<ListGroupItem>
						<div className="gha-activity gha-small">
			                <div className="gha-activity-icon"><span className={icon}></span></div>
			                <div className="gha-message">
								<div className="gha-time">{gitEvent.timeString}</div>
									{gitEvent.userLink} starred {gitEvent.repoLink}
							</div>
							<div className="gha-clear"></div>
			             </div>
					</ListGroupItem>
				);

			default:
				return (<ListGroupItem></ListGroupItem>);
		}
	}
}

export class GitLink extends React.Component {
	render()
	{
		let text = this.props.title ? this.props.title : this.props.link;
		return (
		<a className={this.props.cssClass | "" }
		href={this.props.githubLink ? "https://github.com/" + this.props.link : this.props.link}
		target="_blank">{text}</a>);
	}
}

export class UserGravatar extends React.Component {
	render()
	{
		return (<div className="gha-gravatar-user"><img src={this.props.link} className="gha-gravatar-small"></img></div>);
	}
}

class CommitMessage extends React.Component {
	render()
	{
		const link = "https://github.com/" + this.props.repo + "/compare/" + this.props.shaDiff;

		if (this.props.commitLength == 2){
			return (
				<a href={link}>View comparison for these 2 commits</a>
			);
		} else if (this.props.commitLength > 2){
			return (
				//this.props.commitSize = p.size - 2
				<a href={link}>{this.props.length} more {this.props.length - 2 == 1 ? "commit" : "commits"}</a>
			);
		}
	}
}

class MergeMessage extends React.Component {
	render()
	{
		return (
			<small className="gha-message-merge">
				<br/>
				{this.props.c} {this.props.c>1? "commits" : "commit"}
				with {this.props.a} {this.props.a > 1 ? "additions" : "addition"}
				and {this.props.d} {this.props.d > 1 ? "deletions" : "deletion"}
			</small>
		);
	}
}

const icons = {
  CommitCommentEvent: 'comment-discussion',
  CreateEvent_repository: 'repo-create',
  CreateEvent_tag: 'tag-add',
  CreateEvent_branch: 'git-branch-create',
  DeleteEvent: 'repo-delete',
  FollowEvent: 'person-follow',
  ForkEvent: 'repo-forked',
  GistEvent: 'gist',
  GollumEvent: 'repo',
  IssuesEvent: 'issue-opened',
  IssueCommentEvent: 'comment-discussion',
  MemberEvent: 'person',
  PublicEvent: 'globe',
  PullRequestEvent: 'git-pull-request',
  PullRequestReviewCommentEvent: 'comment-discussion',
  PushEvent: 'git-commit',
  ReleaseEvent: 'tag-add',
  WatchEvent: 'star'
};

// <ul className="gha-commits">
// 	<li>{gitEvent.shaLinks[0]} <small>{gitEvent.shaMsgs[0]}</small></li>
// 	{gitEvent.shaLinks.length == 2 ? <li>{gitEvent.shaLinks[1]} <small>{gitEvent.shaMsgs[1]}</small></li> : ""}
// </ul>

//<small className="gha-message-commits">{gitEvent.commitMessage}</small>
