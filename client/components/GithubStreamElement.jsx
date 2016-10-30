import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ReactMustache from 'react-mustache';
import {Button, Glyphicon, ListGroupItem} from 'react-bootstrap';

const templates = {
        Activity : '<div id="{{id}}" class="gha-activity">\
                           <div class="gha-activity-icon"><span class="octicon octicon-{{icon}}"></span></div>\
                           <div class="gha-message"><div class="gha-time">{{{timeString}}}</div>{{{userLink}}} {{{message}}}</div>\
                           <div class="gha-clear"></div>\
                         </div>',
        SingleLineActivity : '<div class="gha-activity gha-small">\
                                     <div class="gha-activity-icon"><span class="octicon octicon-{{icon}}"></span></div>\
                                     <div class="gha-message"><div class="gha-time">{{{timeString}}}</div>{{{userLink}}} {{{message}}}</div>\
                                     <div class="gha-clear"></div>\
                                   </div>',
        CreateEvent : 'created {{payload.ref_type}} {{{branchLink}}}{{{repoLink}}}',
        DeleteEvent : 'deleted {{payload.ref_type}} {{payload.ref}} at {{{repoLink}}}',
        FollowEvent : 'started following {{{targetLink}}}',
        ForkEvent : 'forked {{{repoLink}}} to {{{forkLink}}}',
        GistEvent : '{{actionType}} {{{gistLink}}}',
        GollumEvent : '{{actionType}} the {{{repoLink}}} wiki<br>{{{userGravatar}}}<small>{{{message}}}</small>',
        IssueCommentEvent : 'commented on {{issueType}} {{{issueLink}}}<br>{{{userGravatar}}}<small>{{comment}}</small>',
        IssuesEvent : '{{payload.action}} issue {{{issueLink}}}<br>{{{userGravatar}}}<small>{{payload.issue.title}}</small>',
        MemberEvent : 'added {{{memberLink}}} to {{{repoLink}}}',
        PublicEvent : 'open sourced {{{repoLink}}}',
        PullRequestEvent : '{{payload.action}} pull request {{{pullRequestLink}}}<br>{{{userGravatar}}}<small>{{payload.pull_request.title}}</small>{{{mergeMessage}}}',
        PullRequestReviewCommentEvent : 'commented on pull request {{{pullRequestLink}}}<br>{{{userGravatar}}}<small>{{comment}}</small>',
        PushEvent : 'pushed to {{{branchLink}}}{{{repoLink}}}<br>\
                    <ul class="gha-commits">{{#payload.commits}}<li><small>{{{committerGravatar}}} {{{shaLink}}} {{message}}</small></li>{{/payload.commits}}</ul>\
                    <small class="gha-message-commits">{{{commitsMessage}}}</small>',
        ReleaseEvent : 'released {{{tagLink}}} at {{{repoLink}}}<br>{{{userGravatar}}}<small><span class="octicon octicon-cloud-download"></span>  {{{zipLink}}}</small>',
        WatchEvent : 'starred {{{repoLink}}}'
    },

    icons = {
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
    },

    singleLineActivities = [
        'CreateEvent',
        'DeleteEvent',
        'FollowEvent',
        'ForkEvent',
        'GistEvent',
        'MemberEvent',
        'WatchEvent'
    ];

export default class GithubStreamElement extends React.Component
{
    constructor(props)
    {
        super(props);
        this.getMessageFor = this.getMessageFor.bind(this);
        this.renderLink = this.renderLink.bind(this);
        this.renderGithubLink = this.renderGithubLink.bind(this);
        this.millisecondsToStr = this.millisecondsToStr.bind(this);
        this.pluralize = this.pluralize.bind(this);
    }

    render()
    {
        let data = this.props.event;
        const p = data.payload;
        data.repoLink = this.renderGithubLink(data.repo.name);
        data.userGravatar = <ReactMustache template='<div class="gha-gravatar-user"><img src="{{url}}" class="gha-gravatar-small"></div>' data={{url: data.actor.avatar_url}}/>;
        console.log("working on");
        console.dir(this.props.event);
        // Get the branch name if it exists.
        if (p.ref) {
            if (p.ref.substring(0, 11) === 'refs/heads/') {
                data.branch = p.ref.substring(11);
            } else {
                data.branch = p.ref;
            }
            data.branchLink = this.renderGithubLink(data.repo.name + '/tree/' + data.branch, data.branch) + ' at ';
        }

        console.dir("line 99");
        // Only show the first 6 characters of the SHA of each commit if given.
        if (p.commits) {
            const shaDiff = p.before + '...' + p.head;
            const length = p.commits.length;
            if (length === 2) {
                // If there are 2 commits, show message 'View comparison for these 2 commits >>'
                data.commitsMessage = <ReactMustache
                    template='<a href="https://github.com/{{repo}}/compare/{{shaDiff}}">View comparison for these 2 commits &raquo;</a>'
                    data={{
                    repo: data.repo.name,
                    shaDiff: shaDiff
                    }}
                    />;
            } else if (length > 2) {
                // If there are more than two, show message '(numberOfCommits - 2) more commits >>'
                let template = '<a href="https://github.com/{{repo}}/compare/{{shaDiff}}">{{length}} more ' + pluralize('commit', length - 2) + ' &raquo;</a>';
                data.commitsMessage = <ReactMustache template={template} data={{
                    repo: data.repo.name,
                    shaDiff: shaDiff,
                    length: p.size - 2
                }}/>;
            }

            p.commits.forEach(function(d, i) {
                if (d.message.length > 66) {
                    d.message = d.message.substring(0, 66) + '...';
                }
                if (i < 2) {
                    d.shaLink = renderGithubLink(data.repo.name + '/commit/' + d.sha, d.sha.substring(0, 6), 'gha-sha');
                } else {
                    // Delete the rest of the commits after the first 2, and then break out of the each loop.
                    p.commits.splice(2, p.size);
                    return false;
                }
            });
            console.dir("line 135");

        }

        // Get the link if this is an IssueEvent.
        if (p.issue) {
            const title = data.repo.name + "#" + p.issue.number;
            data.issueLink = this.renderLink(p.issue.html_url, title);
            data.issueType = "issue";
            if (p.issue.pull_request) {
                data.issueType = "pull request";
            }
        }

        // Retrieve the pull request link if this is a PullRequestEvent.
        if (p.pull_request) {
            let pr = p.pull_request;
            data.pullRequestLink = this.renderLink(pr.html_url, data.repo.name + "#" + pr.number);
            data.mergeMessage = "";

            // If this was a merge, set the merge message.
            if (p.pull_request.merged) {
                p.action = "merged";
                let message = '{{c}} ' + this.pluralize('commit', pr.commits) + ' with {{a}} ' + this.pluralize('addition', pr.additions) + ' and {{d}} ' + this.pluralize('deletion', pr.deletions);
                let mergeTemplate = '<br><small class="gha-message-merge">' + message + '</small>';
                data.mergeMessage = <ReactMustache template={mergeTemplate} data={{
                    c: pr.commits,
                    a: pr.additions,
                    d: pr.deletions
                }}/>;
            }
        }

        // Get the link if this is a PullRequestReviewCommentEvent
        if (p.comment && p.comment.pull_request_url) {
            let title = data.repo.name + "#" + p.comment.pull_request_url.split('/').pop();
            data.pullRequestLink = this.renderGithubLink(p.comment.pull_request_url, title);
        }

        // Get the comment if one exists, and trim it to 150 characters.
        if (p.comment && p.comment.body) {
            data.comment = p.comment.body;
            if (data.comment.length > 150) {
                data.comment = data.comment.substring(0, 150) + '...';
            }
            if (p.comment.html_url && p.comment.commit_id) {
                let title = data.repo.name + '@' + p.comment.commit_id.substring(0, 10);
                data.commentLink = this.renderLink(p.comment.html_url, title);
            }
        }

        if (data.type === 'ReleaseEvent') {
            data.tagLink = this.renderLink(p.release.html_url, p.release.tag_name);
            data.zipLink = this.renderLink(p.release.zipball_url, 'Download Source Code (zip)');
        }

        // Wiki event
        if (data.type === 'GollumEvent') {
            let page = p.pages[0];
            data.actionType = page.action;
            data.message = data.actionType.charAt(0).toUpperCase() + data.actionType.slice(1) + ' ';
            data.message += this.renderGithubLink(page.html_url, page.title);
        }

        if (data.type === 'FollowEvent')
            data.targetLink = this.renderGithubLink(p.target.login);
        if (data.type === 'ForkEvent')
            data.forkLink = this.renderGithubLink(p.forkee.full_name);
        if (data.type === 'MemberEvent')
            data.memberLink = this.renderGithubLink(p.member.login);

        if (p.gist) {
            data.actionType = p.action === 'fork'
                ? p.action + 'ed'
                : p.action + 'd';
            data.gistLink = this.renderLink(p.gist.html_url, 'gist: ' + p.gist.id);
        }

        let message = <ReactMustache template={templates[data.type]} data={data}/>;
        let timeString = this.millisecondsToStr(new Date() - new Date(data.created_at));
        let icon;

        if (data.type == 'CreateEvent' && (['repository', 'branch', 'tag'].indexOf(p.ref_type) >= 0)) {
            // Display separate icons depending on type of create event.
            icon = icons[data.type + '_' + p.ref_type];
        } else {
            icon = icons[data.type]
        }
        let activity = {
            message: message,
            icon: icon,
            timeString: timeString,
            userLink: this.renderGithubLink(data.actor.login)
        };


        // console.dir(<ReactMustache template={templates.SingleLineActivity} data={activity}/>);
        // if (singleLineActivities.indexOf(data.type) > -1) {
        //     return <ReactMustache template={templates.SingleLineActivity} data={activity}/>;
        // }
        // return <ReactMustache template={templates.Activity} data={activity}/>;
        console.dir(activity);
        return <ReactMustache template={templates[data.type]} data={data}/>;
        // return <ReactMustache template={templates.SingleLineActivity} data={{
        //         message: <ReactMustache template={templates[data.type]} data={data}/>,
        //     icon: icon,
        //     timeString: timeString,
        //     userLink: this.renderGithubLink(data.actor.login)
        //     }}/>;
        // render
        //return ( <ListGroupItem></ListGroupItem>);
    }

    renderLink(url, title, cssClass)
    {
        let template = '<a class="' + cssClass + '" href="{{url}}" target="_blank">{{{title}}}</a>';
        if (!title)
            title = url;

        if (typeof(cssClass) === 'undefined')
            cssClass = "";

        return <ReactMustache template={template} event={{
            url: url,
            title: title
        }}/>;
    }

    renderGithubLink(url, title, cssClass) {
        let template;
        if (!title)
            title = url;

        if (typeof(cssClass) === 'undefined')
            cssClass = "";

        template = '<a class="' + cssClass + '" href="{{url}}" target="_blank">{{{title}}}</a>';
        return this.renderLink('https://github.com/' + url, title, cssClass);
    }

    getActivityHTML(data)
    {
        return this.getMessageFor(data);
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

    getMessageFor(data)
    {

    }

}
