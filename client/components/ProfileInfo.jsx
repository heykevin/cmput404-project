import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import Utils from '../utils/utils.js';
import {createStore} from 'redux';
import {
    Button,
    ListGroup,
    ListGroupItem,
    Panel
} from 'react-bootstrap';

const author = Utils.getAuthor();

export class ProfileInfo extends React.Component {

    render() {
        return(
            <div className = "ProfileDisplay">
                <h1>Your Profile</h1>
                <Panel header="Display name">{this.props.author.first_name}</Panel>
                <Panel header="First Name">{this.props.author.first_name}</Panel>
                <Panel header="Last name">{this.props.author.last_name}</Panel>
                <Panel header="Email">{this.props.author.email}</Panel>
                <Panel header="Github username">{this.props.author.github_username}</Panel>
                <Panel header="Bios">{this.props.author.bio}</Panel>
                <Button bsStyle="primary" href="/settings">Edit your profile</Button>
            </div>
        );
    }
}
