import React from 'react';

import PostList from '../components/PostList.jsx';
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';

export default class Home extends React.Component
{
    render()
    {
        return (
            <div className="entry">
                <Login/>
                <Signup/>
            </div>
        );
    }
}
