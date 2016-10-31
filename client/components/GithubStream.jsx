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
import {push} from 'react-router-redux';
import {ProgressBar, List, ListGroup} from 'react-bootstrap';
import { GithubStreamEvent, GitLink } from './GithubStreamEvent.jsx';
import Utils from '../utils/utils.js'

export class GithubStream extends React.Component
{
    constructor(props)
    {
        super(props);
		let author = Utils.getAuthor();
		if (author.github_username) {
			this.props.dispatch({type: 'gitGetEvents', username: author.github_username});
            this.props.dispatch({type: 'gitGetUser', username: author.github_username});
		}

		this.state = {
			events: [],
			unresolved: false,
			hasGitStream: Boolean(author.github_username)
		}
    }

    render()
    {

        // render
		if (!this.state.hasGitStream) {
            return (<ReactMustache template={templates.NoActivity}/>);
		}

        if (this.props.events.length && this.props.user) {
            const user = this.props.user;
            console.log(user.avatar_url);
            return (
                <div>
                    <div className="gha-header">
                        <div className="gha-github-icon"><span className="octicon octicon-mark-github"></span></div>
                        <div className={user.name ? "gha-user-info" : "gha-user-info without-name"}>
                            {user.name ? <GitLink githubLink={false} link={user.html_url} title={user.name}/> : <span></span>}
                            <p>
                                <GitLink githubLink={false} link={user.html_url} title={user.login}/>
                            </p>
                        </div>
                        <div className="gha-gravatar">
                            <GitLink githubLink={false} link={user.html_url} title={<img src={user.avatar_url}></img>}/>
                        </div>
                    </div>
                    <ListGroup className="git-group">
                        {this.props.events.map((event, index) => {
                            if (index < this.props.events.length) {
                                return (<GithubStreamEvent key={event.id} event={event}/>);
                            }
                        })}
                    </ListGroup>
                </div>
            );
        } else if (this.state.unresolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else {
            return (
                <div className="no-posts">
                    You currently do not have any events available to read.
                </div>
            );
        }
    }

    changePage(page)
    {
        this.props.dispatch(push('/page=' + page));
    }
}

// export the connected class
function mapStateToProps(state) {

    return {
        events: state.git.events || [],
        user: state.git.user || {},
        resolved: state.git.resolved || false
    };
}
export default connect(mapStateToProps)(GithubStream);
