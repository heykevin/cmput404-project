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

export class ProfileInfo extends React.Component {

    render() {
        return(
            <div className = "ProfileDisplay">
                <Panel bsStyle="primary" header="Display name">{this.props.author.displayName}</Panel>
                <Panel bsStyle="primary" header="First Name">{this.props.author.first_name}</Panel>
                <Panel bsStyle="primary" header="Last name">{this.props.author.last_name}</Panel>
                <Panel bsStyle="primary" header="Email">{this.props.author.email}</Panel>
                <Panel bsStyle="primary" header="Github username">{this.props.author.github_username}</Panel>
                <Panel bsStyle="primary" header="Bios">{this.props.author.bio}</Panel>
            </div>
        );
    }
}

// export the connected class
function mapStateToProps(state, props) {

    // pass the state defaultValues
    return {
        author: state.author || Utils.getAuthor(),
    };
}
export default connect(mapStateToProps)(ProfileInfo);
