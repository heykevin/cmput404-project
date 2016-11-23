import React from 'react';

import PostList from '../components/PostList.jsx';
import GithubStream from '../components/GithubStream.jsx';

import Utils from '../utils/utils.js'

export default class Dashboard extends React.Component
{
    render()
    {
        const isActive = Utils.getAuthor().is_active;
        if (!isActive) {
            return (
                <div className="warning-text">
                    As we are a prestigous blogging community, (｡ŏ_ŏ) please wait for admin to confirm your registration.<br/>
                And don't panic when you cannot log in next time. It only means that you haven't been approved yet.<br/>
                    Once you're approved, you'll be able to login.
                </div>
            )
        } else {
            return (
                <div className="page-home flex">
                    <div className="git-stream">
                        <GithubStream/>
                    </div>
                    <div>
                        <div className="posts-stream">
                            <PostList className="posts-stream" method="author" canEdit={false}/>
                        </div>
                        <div className="posts-stream">
                            <PostList className="posts-stream" method="author" foreign={true} canEdit={false}/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
