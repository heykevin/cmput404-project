import React from 'react';

import PostList from '../components/PostList.jsx';

export default class Dashboard extends React.Component
{
    render()
    {
        // http://service/author/posts
        return(
            <div className="page-home">
                <span>MATHA FUCKING DASHBOARD</span>
                <PostList method="author" canEdit={false}/>
            </div>
        );
    }
}
