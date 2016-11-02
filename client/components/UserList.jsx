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
        const author = Utils.getAuthor(),
            actor = {
                id: author.id,
                host: author.host
            }
        this.props.dispatch({type: 'usersFetchFriendsList', authorId: author.id, dispatch: this.props.dispatch});
        this.props.dispatch({type: 'usersFetchFriendRequestsList', actor: actor, dispatch: this.props.dispatch});
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
            list = this.props.friendRequests;
            listResolved = this.props.friendRequestsResolved;
        } else {
            list = this.props.users;
            listResolved = this.props.usersResolved;
        }

        // render
        if (list && list.length) {

            const per_page = 10;
            const pages = Math.ceil(list.length / per_page);
            const current_page = this.props.page;
            const start_offset = (current_page - 1) * per_page;
            let start_count = 0;

            if (this.props.toastMessage && !this.props.error && this.props.status && this.props.status !== 0) {
                notify.show(this.props.toastMessage);
            }

            return (

                <div>
                    <div className={(this.props.status === 0 ? "visible" : "invisible") + " hide-yall-kids-hide-yall-wife"}>
                        <i className="fa fa-spinner fa-spin"></i>
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
                                        if (user.id != this.props.author.id) {
                                            return (<UserListElement view={view} key={user.id} id={user.id}/>);
                                        }
                                    }
                                })}
                            </tbody>
                        </Table>
                        <Pagination className="users-pagination pull-right" bsSize="medium" maxButtons={10} first last next prev boundaryLinks items={pages} activePage={current_page} onSelect={this.changePage}/>
                    <Notifications />
                </div>
            );
        } else if (!listResolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else if (!list.length && listResolved) {
            return (
                <div className="text-center">
                    Sorry, you do not have any {view === "friendrequests" ? "friend requests" : "friends"}. Check out all <a href="/friends?view=allauthors">authors</a> and you might find someone interesting!
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    Service Temporarily Unavailable. Please come back later. {this.props.error
                        ? this.props.error
                        : ""}
                </div>
            );
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

        friendRequests: state.users.friendRequests || [],
        friendRequestsResolved: state.users.friendRequestsResolved,

        page: Number(state.routing.locationBeforeTransitions.query.page) || 1,

        error: state.users.error,
        author: state.users.author || Utils.getAuthor(),
        status: state.users.requestStatus //undefined, -1 error, 0 sending, 1 success
    };
}
export default connect(mapStateToProps)(UserList);
