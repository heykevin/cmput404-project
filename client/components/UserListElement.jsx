import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ProgressBar} from 'react-bootstrap';

import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export class UserListElement extends React.Component
{
    constructor(props)
    {
        super(props);

        this.isFriendWith = this.isFriendWith.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.sendUnfriendRequest = this.sendUnfriendRequest.bind(this);
        this.sentFriendRequestTo = this.sentFriendRequestTo.bind(this);
        this.receivedFriendRequestFrom = this.receivedFriendRequestFrom.bind(this);
        this.declineFriendRequest = this.declineFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.finder = this.finder.bind(this);
        this.composeData = this.composeData.bind(this);
    }

    render()
    {
        // get the user element data
        let user,
            action,
            isMyFriend,
            template,
            displayName = "";

        const users = this.props.view === "myfriends"
            ? this.props.friends
            : this.props.view === "friendrequests"
                ? this.props.author ? Utils.getAuthor().request_received : this.props.author.request_received
                : this.props.users;
        for (const val of users) {
            if (val.id === this.props.id) {
                user = val;
                isMyFriend = this.isFriendWith(user);
                break;
            }
        }

        if (!user) {
            return null;
        } else {
            console.log("hello", user.host, user.host in [getApi(), "http://localhost:8000", "http://127.0.0.1:8000"]);
            displayName = [getApi(), "http://localhost:8000", "http://127.0.0.1:8000"].indexOf(user.host) > -1 ? user.displayName : user.displayName.substr(2);
        }

        if (this.props.view === "allauthors" && !this.props.authorResolved) {
            return (
                <tr>
                    <td>{displayName}</td>
                    <td>{user.bio
                            ? user.bio
                            : displayName + " is rather private. So no bio is available."}</td>
                        <td><ProgressBar active now={100}/></td>
                </tr>
            );
        }

        switch (this.props.view) {
            case "myfriends":
                // friend requests view
                template = <Button bsStyle="default" data-id={user.id} data-display-name={displayName} data-host={user.host} data-url={user.url}  onClick={this.sendUnfriendRequest}>Unfriend<Glyphicon glyph="remove-sign"/>
                </Button>;
                break;
            case "friendrequests":
                // friend requests view
                template = <div>
                    <Button bsStyle="danger" data-id={user.id} data-display-name={displayName} data-host={user.host} data-url={user.url}  onClick={this.declineFriendRequest}>
                        Decline<Glyphicon glyph="remove-circle"/>
                    </Button>
                    <Button bsStyle="success" data-id={user.id} data-display-name={displayName} data-host={user.host} data-url={user.url}  onClick={this.sendFriendRequest}>
                        Accept<Glyphicon glyph="ok-circle"/>
                    </Button>
                </div>;
                break;
            default:
                // all authors view
                if (this.props.author.id === user.id) {
                    return null;
                }
                console.log("is " + displayName + " my Friend??? " + isMyFriend);
                const requestSent = this.sentFriendRequestTo(user),
                    requestReceived = this.receivedFriendRequestFrom(user);
                console.log(displayName, 'requestSent', requestSent, 'requestReceived', requestReceived);
                let waitAction = <Button bsStyle="info" disabled={true}>Request has been sent<Glyphicon glyph="send"/></Button>,
                    viewAction = <Button bsStyle="default" href="/friends?view=friendrequests">View request from {displayName}<Glyphicon glyph="eye-open"/></Button>,
                    sendAction = <Button bsStyle="default" data-id={user.id} data-display-name={displayName} data-host={user.host} data-url={user.url} onClick={this.sendFriendRequest}>
                        Send a friend request<Glyphicon glyph="plus-sign"/>
                    </Button>;
                if (isMyFriend) {
                    template = <Button bsStyle="default" data-id={user.id} data-display-name={displayName} data-host={user.host} data-url={user.url} onClick={this.sendUnfriendRequest}>Unfriend<Glyphicon glyph="remove-sign"/>
                    </Button>;
                } else if (requestSent) {
                    template = waitAction;
                } else if (requestReceived) {
                    template = <div>{viewAction}</div>;
                } else {
                    template = sendAction;
                }
                break;

        }
        // render
        return (
            <tr>
                <td>{displayName}</td>
                <td>{user.bio
                        ? user.bio
                        : displayName + " is rather private. So no bio is available."}</td>
                <td>{template}</td>
            </tr>
        );
    }

    composeData(event) {
        const target = {
                id: event.target.dataset.id,
                displayName: event.target.dataset.displayName,
                host: event.target.dataset.host,
                url: event.target.dataset.url
            },
            actor = {
                id: this.props.author.id,
                displayName: this.props.author.displayName,
                host: this.props.author.host,
                url: event.target.dataset.url
            };
        console.log(target, actor);
        return {target, actor};
    }

    sendFriendRequest(event) {
        const {target, actor} = this.composeData(event);
        if (!target.id) {
            return;
        }

        this.props.dispatch({type: 'users.sendingRequest', targetId: target.id});

        this.props.dispatch({type: 'usersBefriendAuthor', actor, target});

        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: this.props.author.id});
    }

    sendUnfriendRequest(event) {
        const {target, actor} = this.composeData(event);
        if (!target.id) {
            return;
        }

        this.props.dispatch({type: 'users.sendingRequest', targetId: target.id});

        this.props.dispatch({type: 'usersUnfriendAuthor', actor, target});

        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: this.props.author.id});
    }

    declineFriendRequest(event) {
        const {target, actor} = this.composeData(event);
        if (!target.id) {
            return;
        }

        this.props.dispatch({type: 'users.sendingRequest', targetId: target.id});

        this.props.dispatch({type: 'usersDeclineFriendRequest', target, actor});

        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: this.props.author.id});
    }

    acceptFriendRequest(event) {
        const {target, actor} = this.composeData(event);
        if (!target.id) {
            return;
        }

        this.props.dispatch({type: 'users.sendingRequest', targetId: target.id});

        this.props.dispatch({type: 'usersAcceptFriendRequest', target, actor, accepted: 'true'});

        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: this.props.author.id});
    }

    isFriendWith(user) {
        return this.finder(this.props.friends, user.id);
    }

    sentFriendRequestTo(user) {
        return this.finder(this.props.author.request_sent, user.id);
    }

    receivedFriendRequestFrom(user) {
        return this.finder(this.props.author.request_received, user.id);
    }

    finder(sourceList, targetId) {
        if (sourceList) {
            for (const source of sourceList) {
                if (source.id === targetId) {
                    return true;
                }
            }
        }
        return false;
    }
}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        users: state.users.users || [],
        friends: state.users.friends || [],
        id: own_props.id,
        author: state.users.author || {},
        authorResolved: state.users.authorResolved
    }
}
export default connect(mapStateToProps)(UserListElement);
