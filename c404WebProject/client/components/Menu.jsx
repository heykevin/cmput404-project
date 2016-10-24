import React from 'react';
import {connect} from 'react-redux';
import {Nav, NavItem, Glyphicon} from 'react-bootstrap';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

export class Menu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.logout = this.logout.bind(this);
        this.clearError = this.clearError.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    render()
    {
        if (this.props.loggedIn) {
            return (
                <Nav bsStyle="pills" onSelect={handleSelect}>
                    <IndexLinkContainer to="/">
                        <NavItem className="nav-item">
                            Hello World Blog
                        </NavItem>
                    </IndexLinkContainer>
                    <LinkContainer to="/dashboard">
                        <NavItem className="nav-item float-right" eventKey={"dashboard"}>
                            Dashboard
                            <Glyphicon glyph="dashboard"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/profile">
                        <NavItem className="nav-item float-right" eventKey={"profile"}>
                            Profile
                            <Glyphicon glyph="user"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/">
                        <NavItem className="nav-item float-right" eventKey={"logOut"}>
                            Log Out
                            <Glyphicon glyph="log-out"/>
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
                    <LinkContainer to="/login">
                        <NavItem className="nav-item float-right" eventKey={"logIn"}>
                            Log In
                            <Glyphicon glyph="log-in"/>
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                        <NavItem className="nav-item float-right" eventKey={"signUp"}>
                            Sign Up
                            <Glyphicon glyph="plus"/>
                        </NavItem>
                    </LinkContainer>
                </Nav>
            );
        }
    }

    handleSelect(key) {
        switch (key) {
            case "logIn":

                break;
            case "signUp":

                break;
            case "logOut":

                break;
            case "dashboard":

                break;
            case "profile":

                break;
            default:

        }
    }

    logout() {
        this.props.dispatch(logout())
    }

    clearError() {
        this.props.dispatch(clearError())
    }
}

function mapStateToProps(state) {
    return {loggedIn: state.loggedIn};
}
export default connect(mapStateToProps)(Menu);
