import React from 'react';

import PostList from '../components/PostList.jsx';

export default class Home extends React.Component
{
    render()
    {
        return(
            <div className="page-home">
                <PostList method="posts"/>
            </div>
        );
    }
}
