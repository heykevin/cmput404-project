import React from 'react';

import PostList from '../components/PostList.jsx';

export default class Dashboard extends React.Component
{
    render()
    {
        return(
            <div className="page-home">
                <PostList visibility = "PUBLIC"/>
            </div>
        );
    }
}
