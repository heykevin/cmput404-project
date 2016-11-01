import React from 'react';

import PostList from '../components/PostList.jsx';
import AuthorEdit from '../components/AuthorEditForm.jsx';

export default class Profile extends React.Component
{
    render() {
        return(
            <div className="page-profile">
                <h1>My Profile</h1>
                <a href="/settings">Edit your profile</a>

                <AuthorEdit method="posts"/>
            </div>
        );
    }
}
