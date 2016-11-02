import React from 'react';
import {Nav, NavItem, Glyphicon} from 'react-bootstrap';
import { connect } from 'react-redux';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

import UserList from '../components/UserList.jsx';
import Utils from '../utils/utils.js';

export class Friends extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
		return (
            <div className="friends-content">
                <Nav bsStyle="tabs" justified>
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
                        <NavItem className="nav-item">
                            Friend Requests
                        </NavItem>
                    </LinkContainer>
                </Nav>
                <div className="user-list">
    			     <UserList view={this.props.view}/>
                </div>
            </div>
		);
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
        view: state.routing.locationBeforeTransitions.query.view.toLowerCase() || "allauthors",
        author: state.users.author || Utils.getAuthor()
    };
}
export default connect(mapStateToProps)(Friends);
