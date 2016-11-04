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
                <Panel header="Display name">{this.props.auth.displayName}</Panel>
                <Panel header="First Name">{this.props.first_name}</Panel>
                <Panel header="Last name">{this.props.last_name}</Panel>
                <Panel header="Email">{this.props.email}</Panel>
                <Panel header="Github username">{this.props.github_username}</Panel>
                <Panel header="Bios">{this.props.bio}</Panel>
                <Button bsStyle="primary" href="/settings">Edit your profile</Button>
            </div>
        );
    }
}

// export the connected class
function mapStateToProps(state, props) {

    // set the form data
    let form_data = {
        first_name: state.auth.first_name,
        last_name: state.auth.last_name,
        email: state.auth.email,
        github_username: state.auth.github_username,
        bio: state.auth.bio
    };


    // pass the state values
    return {
        form_data,
    };
}
export default connect(mapStateToProps)(ProfileInfo);
