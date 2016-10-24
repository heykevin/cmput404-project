import React from 'react';

import PostList from '../components/PostList.jsx';

export default class Dashboard extends React.Component
{
    render()
    {
        // Need to add SERVERONLY to
        return(
            <div className="page-home">
                <span>MATHA FUCKING DASHBOARD</span>
                <PostList visibility="['PUBLIC','FOAF','FRIENDS','PRIVATE']"/>
            </div>
        );
    }
}
