import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import PostList from '../components/PostList.jsx';
import GithubStream from '../components/GithubStream.jsx';

import Utils from '../utils/utils.js'

const FOREIGN = "foreign", LOCAL = "local";

export class Dashboard extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    render()
    {
        console.log(this.props.view);
        const isActive = Utils.getAuthor().is_active;
        if (!isActive) {
            return (
                <div className="warning-text">
                    As we are a prestigous blogging community, (｡ŏ_ŏ) please wait for admin to confirm your registration.<br/>
                And don't panic when you cannot log in next time. It only means that you haven't been approved yet.<br/>
                    Once you're approved, you'll be able to login.
                </div>
            )
        } else {
            return (
                <div className="page-home flex">
                    <div className="git-stream">
                        <GithubStream/>
                    </div>
                    <div className="posts-stream">
                        <Nav bsStyle="tabs" justified activeKey={this.props.view} onSelect={this.onSelect}>
                            <NavItem className="nav-item" eventKey={LOCAL}>
                                Local Posts
                            </NavItem>
                            <NavItem className="nav-item" eventKey={FOREIGN}>
                                Foreign Posts
                            </NavItem>
                        </Nav>
                        <div className={this.props.view !== "foreign" ? "visible" : "invisible"}>
                            <PostList method="author" canEdit={false}/>
                        </div>
                        <div className={this.props.view === "foreign" ? "visible" : "invisible"}>
                            <PostList method="author" foreign={true} canEdit={false}/>
                        </div>
                    </div>
                </div>
            );
        }
    }

    onSelect(key)
    {
        console.log(key);
        if (key === FOREIGN) {
            this.props.dispatch(push('/dashboard?view=' + FOREIGN));
        } else {
            this.props.dispatch(push('/dashboard'));
        }
    }
}


// export the connected class
function mapStateToProps(state) {
    const view = state.routing.locationBeforeTransitions.query.view && state.routing.locationBeforeTransitions.query.view.toLowerCase() === FOREIGN;
    return {
        view: view ? FOREIGN : LOCAL
    }
}
export default connect(mapStateToProps)(Dashboard);
