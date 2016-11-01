import React from 'react';
import {Nav, NavItem, Glyphicon} from 'react-bootstrap';
import { connect } from 'react-redux';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

import UserList from '../components/UserList.jsx';

export class Friends extends React.Component
{
    constructor(props)
    {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.getList = this.getList.bind(this);
    }

    render()
    {
        let userList = this.getList(this.props.view);
		return (
            <div className="friends-content">
                <Nav bsStyle="tabs" justified onSelect={this.handleSelect}>
                    <LinkContainer to="/friends?view=allauthors">
                        <NavItem className="nav-item">
                            All Authors
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/friends?view=myfriends">
                        <NavItem className="nav-item">
                            My Friends
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/friends?view=friendrequests">
                        <NavItem className="nav-item" eventKey={"friendRequests"}>
                            Friend Requests
                        </NavItem>
                    </LinkContainer>
                </Nav>
                <div className="user-list">
    			     {userList}
                </div>
            </div>
		);
    }

    getList(view)
    {
        switch (view.toLowerCase()) {
            case "myfriends":
                return <UserList view="myfriends"/>
                break;
            default:
                return <UserList view="allauthors"/>
        }
    }

    handleSelect(key)
    {
        switch (key) {
            case "allAuthors":
                break;
            default:
                break;
        }
        return;
    }
}
function mapStateToProps(state, ownProps)
{
    return {
        view: state.routing.locationBeforeTransitions.query.view || "allauthors"
    };
}
export default connect(mapStateToProps)(Friends);
