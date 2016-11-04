import React from 'react';
import Utils from '../utils/utils.js';
import {
    Button,
    ListGroup,
    
} from 'react-bootstrap';

const listgroupInstance = (
    <ListGroup>
        <ListGroupItem header="Display name">Some body text</ListGroupItem>
        <ListGroupItem header="First Name" href="#">Linked item</ListGroupItem>
        <ListGroupItem header="Last Name" bsStyle="danger">Danger styling</ListGroupItem>
        <ListGroupItem header="Email" bsStyle="danger">Danger styling</ListGroupItem>
        <ListGroupItem header="Github username" bsStyle="danger">Danger styling</ListGroupItem>
        <ListGroupItem header="Bio" bsStyle="danger">Danger styling</ListGroupItem>
    </ListGroup>
);

export default class Profile extends React.Component {

    render() {
        return(
            <div>
                <Button bsStyle="primary" href="/settings">Edit your profile</Button>
                <listgroupInstance/>
            </div>
        );
    }
}
