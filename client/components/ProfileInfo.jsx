import React from 'react';
import Utils from '../utils/utils.js';
import {
    Button,
    ListGroup,
    ListGroupItem,
    Panel
} from 'react-bootstrap';

const author = Utils.getAuthor();

export default class ProfileInfo extends React.Component {

    render() {
        return(
            <div className = "ProfileDisplay">
                <h1>Your Profile</h1>
                <Panel header="Display name">{author.displayName}</Panel>
                <Panel header="First Name">{author.first_name}</Panel>
                <Panel header="Last name">{author.last_name}</Panel>
                <Panel header="Email">{author.email}</Panel>
                <Panel header="Github username">{author.github_username}</Panel>
                <Panel header="Bios">{author.bio}</Panel>
                <Button bsStyle="primary" href="/settings">Edit your profile</Button>
                <Button bsStyle="primary" href="/profile">Update</Button>
            </div>
        );
    }
}
