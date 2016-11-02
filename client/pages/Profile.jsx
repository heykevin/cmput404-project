import React from 'react';
import PostList from '../components/PostList.jsx';
import AuthorEditForm from '../components/AuthorEditForm.jsx';
import Utils from '../utils/utils.js';
import {
    Button
} from 'react-bootstrap';

const author = Utils.getAuthor();
console.log(author);

export default class Profile extends React.Component {
    render() {
        return(
            <div className="page-profile">
                <h1>My Profile</h1>
                <Button href="/settings">Edit your profile</Button>
                <div>
                    <h3>Display name</h3>
                        <span>{author.displayName}</span>
                </div>
                <div>
                    <h3>First Name</h3>
                        <span>{author.first_name}</span>
                </div>
                <div>
                    <h3>Last Name</h3>
                        <span>{author.last_name}</span>
                </div>
                <div>
                    <h3>Email</h3>
                        <span>{author.email}</span>
                </div>
                <div>
                    <h3>Github username</h3>
                        <span>{author.github_username}</span>
                </div>
                <div>
                    <h3>Bio</h3>
                        <span>{author.bio}</span>
                </div>
            </div>
        );
    }
}
