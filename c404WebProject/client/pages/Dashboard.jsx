import React from 'react';

import PostList from '../components/PostList.jsx';
import GithubStream from '../components/GithubStream.jsx';

export default class Dashboard extends React.Component
{
    render()
    {
        // http://service/author/posts
        return(
            <div className="page-home flex">
                <div className="git-stream">
                    <GithubStream/>
                </div>
                <div className="posts-stream">
                    <PostList className="posts-stream" method="author" canEdit={false}/>
                </div>
            </div>
        );
    }
}
