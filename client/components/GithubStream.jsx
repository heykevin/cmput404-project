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
		if (author.github) {
			this.props.dispatch({type: 'gitGetEvents', username: author.github});
            this.props.dispatch({type: 'gitGetUser', username: author.github});
		}

		this.state = {
			events: [],
			unresolved: false,
			hasGitStream: Boolean(author.github)
		}
    }

    render()
    {
        const author = Utils.getAuthor();
        // render
		if (!Boolean(author.github)) {
            return (
                <div>
                    <div className="gha-header">
                        <div className="gha-github-icon"><span className="octicon octicon-mark-github"></span></div>
                        <div className="gha-user-info without-name"></div>
                    </div>
                    <div className="list-group-item text-center">
                        You haven't enabled github activity stream.<br/>
                    Go to your <a href="/profile">profile</a>, and add your github name to enable this feature!
                    </div>
                </div>
            );
		}

        if (this.props.events.length && this.props.user) {
            const user = this.props.user;
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
        } else if (!this.props.events.length && this.props.resolved) {
            return (    <div className="gha-header">
                            <div className="gha-github-icon"><span className="octicon octicon-mark-github"></span></div>
                                <div className="git-warning">
                                    <span>(눈‸눈) Hmm...Looks like someone ate your recent Github activities. So...go commit some stuff, like right now?</span>
                                </div>
                        </div>
                    );
        } else if (!this.props.resolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else {
            return (    <div className="gha-header">
                            <div className="gha-github-icon"><span className="octicon octicon-mark-github"></span></div>
                                <div className="git-warning">
                                    <span>ლ(´•д• ̀)ლ Sorry! Something's up with Github!</span>
                                </div>
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
