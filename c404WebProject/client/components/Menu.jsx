import React from 'react';
import {connect} from 'react-redux';
import {Nav, NavItem, Glyphicon} from 'react-bootstrap';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

export class Menu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    render()
    {
        if (Number(sessionStorage.loggedIn)) {
            return (
                <Nav bsStyle="pills" onSelect={this.handleSelect}>
                    <NavItem className="nav-item">
                        Hello World Blog
                    </NavItem>
                    <NavItem className="nav-item float-right" eventKey={"logOut"}>
                        Log Out
                        <Glyphicon glyph="log-out"/>
                    </NavItem>
                    <LinkContainer to="/profile">
                        <NavItem className="nav-item float-right">
                            Profile
                            <Glyphicon glyph="user"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/newpost">
                        <NavItem className="nav-item float-right">
                            Add Post
                            <Glyphicon glyph="plus-sign"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/dashboard">
                        <NavItem className="nav-item float-right">
                            Dashboard
                            <Glyphicon glyph="dashboard"/>
                        </NavItem>
                    </LinkContainer>
                </Nav>
            );
        } else {
            return (
                <Nav bsStyle="pills" onSelect={this.handleSelect}>
                    <IndexLinkContainer to="/">
                        <NavItem className="nav-item">
                            Hello World Blog
                        </NavItem>
                    </IndexLinkContainer>
                    <LinkContainer to="/signup">
                        <NavItem className="nav-item float-right">
                            Sign Up
                            <Glyphicon glyph="plus"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <NavItem className="nav-item float-right">
                            Log In
                            <Glyphicon glyph="log-in"/>
                        </NavItem>
                    </LinkContainer>
                </Nav>
            );
        }
    }

    handleSelect(key) {
        switch (key) {
            case "logOut":
                this.props.dispatch({type: "authLogout"});
                break;
            default:

        }
    }
}

function mapStateToProps(state) {
    return {loggedIn: state.loggedIn};
}
export default connect(mapStateToProps)(Menu);
