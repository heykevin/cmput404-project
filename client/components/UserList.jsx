import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, Table, Pagination} from 'react-bootstrap';
import Notifications, {notify} from 'react-notify-toast';

import UserListElement from './UserListElement.jsx';
import Utils from '../utils/utils.js';

export class UserList extends React.Component
{
    constructor(props)
    {
        super(props);
        const author = Utils.getAuthor();
        this.props.dispatch({type: 'users.clearState'});
        this.props.dispatch({type: 'usersSyncRemoteFriends'});
        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: author.id});
        this.props.dispatch({type: 'usersFetchFriendsList', authorId: author.id, dispatch: this.props.dispatch});
        this.props.dispatch({type: 'usersFetchList'});

        // bind <this> to the event method
        this.changePage = this.changePage.bind(this);
    }

    render()
    {

        // Mode
        const view = this.props.view.toLowerCase();
        let list,
            listResolved;

        if (view === "myfriends") {
            list = this.props.friends;
            listResolved = this.props.friendsResolved;
        } else if (view === "friendrequests") {
            list = this.props.author.request_received;
            listResolved = this.props.authorResolved;
        } else {
            list = this.props.users;
            listResolved = this.props.usersResolved;
        }

        // render
        if (list && list.length && listResolved) {

            const per_page = 10;
            const pages = Math.ceil(list.length / per_page);
            const current_page = this.props.page;
            const start_offset = (current_page - 1) * per_page;
            let start_count = 0;

            return (

                <div className="friends">
                    <div className={(this.props.sending ? "visible" : "invisible") + " hide-yall-kids-hide-yall-wife"}>
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                        <div className={(view === "friendrequests" ? "visible" : "invisible") + " info-text"}>
                            <span>
                                Here are authors, who are following you. <br/>
                                <ul>
                                    <li>If you <strong>accept</strong> an author's friend request, that means you'll start following the author, and you guys would become friends. Isn't that nice? σ ﾟ∀ ﾟ) ﾟ∀ﾟ)σ</li>
                                    <li>If you <strong>decline</strong> an author's friend request, we will stop the author from following <i>(stalking)</i> you to protect your privacy. How considerate we are! (⌐■_■)</li>
                                </ul>
                            </span>
                        </div>
                        <Table bordered hover responsive striped>
                            <thead>
                                <tr>
                                    <th>Display Name</th>
                                    <th>Bio</th>
                                    <th className="header-action">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((user, index) => {
                                    if (index >= start_offset && start_count < per_page) {
                                        start_count++;
                                        return (<UserListElement view={view} key={user.id} id={user.id}/>);
                                    }
                                })}
                            </tbody>
                        </Table>
                        <Pagination className="users-pagination pull-right" bsSize="medium" maxButtons={10} first last next prev boundaryLinks items={pages} activePage={current_page} onSelect={this.changePage}/>
                    <Notifications />
                </div>
            );
        } else if (!list || !listResolved) {
            // show the loading state
            return (<div>
                        <ProgressBar active now={100}/>
                        <Notifications />
                    </div>);
        } else if (!list.length && listResolved) {
            return (
                <div className="text-center align-center">
                <span className="warning-text">
                    Sorry, you do not have any {view === "friendrequests" ? "friend requests" : "friends"}. Check out all <a href="/friends?view=allauthors">authors</a> and you might find someone interesting!
                </span>
                <Notifications />
            </div>
            );
        } else {
            return (
                <div className="text-center align-center">
                <span className="warning-text">
                    Service Temporarily Unavailable. Please come back later. {this.props.error
                        ? this.props.error
                        : ""}
                </span>
            </div>
            );
        }
    }

    componentDidUpdate()
    {
        if (this.props.toastMessage && !this.props.error && this.props.sending === false) {
            notify.show(this.props.toastMessage, "success", 3000);
            window.setTimeout(function() { this.props.dispatch({type: 'users.clearToastMessage'});}.bind(this), 100);
        }
    }

    /**
     * Change the user lists' current page
     */
    changePage(page)
    {
        this.props.dispatch(push('/friends?view=' + this.props.view + '&page=' + page));
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        users: state.users.users || [],
        usersResolved: state.users.usersResolved,

        friends: state.users.friends || [],
        friendsResolved: state.users.friendsResolved,

        author: state.users.author || {},
        authorResolved: state.users.authorResolved,

        page: Number(state.routing.locationBeforeTransitions.query.page) || 1,

        error: state.users.error,
        toastMessage: state.users.toastMessage,
        sending: state.users.sending

    };
}
export default connect(mapStateToProps)(UserList);
