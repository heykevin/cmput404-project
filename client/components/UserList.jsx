import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, Table, Pagination} from 'react-bootstrap';

import UserListElement from './UserListElement.jsx';
import Utils from '../utils/utils.js';

export class UserList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.props.dispatch({type: 'usersFetchFriendsList', authorId: Utils.getAuthor().id, dispatch: this.props.dispatch});
        this.props.dispatch({type: 'usersFetchList'});

        // bind <this> to the event method
        this.changePage = this.changePage.bind(this);
    }

    render()
    {

        // Mode
        const view = this.props.view.toLowerCase();
        let list, listResolved;

        if (view === "myfriends") {
            list = this.props.friends;
            listResolved = this.props.friendsResolved;
        } else {
            list = this.props.users;
            listResolved = this.props.usersResolved;
        }

        // render
        if (list.length) {

            const per_page = 10;
            const pages = Math.ceil(list.length / per_page);
            const current_page = this.props.page;
            const start_offset = (current_page - 1) * per_page;
            let start_count = 0;

            return (
                <div>
                    <Table bordered hover responsive striped>
                        <thead>
                            <tr>
                                <th>Display Name</th>
                                <th>Bio</th>
                                <th>Action</th>
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
                </div>
            );
        } else if (!listResolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else if (!list.length && listResolved){
            return (
                <div className="text-center">
                    Sorry, you do not have any friends. Check out all <a href="/friends?view=allauthors">authors</a> and you might find someone interesting!
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    Service Temporarily Unavailable. Please come back later.
                    {this.props.error ? this.props.error : ""}
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
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1,
        error: state.users.error
    };
}
export default connect(mapStateToProps)(UserList);
