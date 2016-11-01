import React from 'react';

import PostList from '../components/PostList.jsx';
import AuthorEditForm from '../components/AuthorEditForm.jsx';

export default class Profile extends React.Component
{
    render() {
        return(
            <div className="page-profile">
                <h1>My Profile</h1>
                <a href="/settings">Edit your profile</a>
                <h2> First Name </h2>
                <div> AuthorEditForm.first_name </div>
            </div>
        );
    }
}
