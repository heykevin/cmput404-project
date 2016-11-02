import {
    call,
    put
} from 'redux-saga/effects';

import ApiUsers from '../api/users';
import Utils from '../utils/utils.js';

export function* usersFetchList(action) {
    try {
        // call the api to get the users list
        console.log("users fetch list")
        const users = yield call(ApiUsers.getUsers);
        console.log(users);
        // dispatch the success action with the users attached
        yield put({
            type: 'users.fetchUsersSuccess',
            users: users,
        });
    } catch (error) {
        yield put({
            type: 'users.fetchUsersFailure',
            error: error
        });
    }

}

// Should only be used for getting currently authenticated user.
export function* usersFetchAuthorProfile(action) {
    try {
        const profile = yield call(ApiUsers.getAuthorProfile, action);
        yield put({
            type: 'users.fetchAuthorProfileSuccess',
            profile: profile,
        });
    } catch (error) {
        yield put({
            type: 'users.fetchAuthorProfileFailure',
            error: error,
        });
    }
}

export function* usersFetchFriendsList(action) {
    try {
        let friends = [], dispatch = action.dispatch;
        // call the api to get the users list
        console.log("users fetch friend list");
        const friendsIds = yield call(ApiUsers.getFriendsIds, action);
        for (const friendId of friendsIds) {
            friends.push(yield call(ApiUsers.getAuthorProfile, {authorId: friendId}));
        }
        Promise.all(friends).then(() => {
            console.log("here?");
            action.dispatch({type: 'users.fetchFriendsSuccess', friends});
        });
    } catch (error) {
        yield put({
            type: 'users.fetchFailure',
            error: error
        });
    }
}

export function* usersUnfriendAuthor(action) {
    try {
        console.log("users unfriend author");
        const response = yield call(ApiUsers.postUnfriendRequest, action);
        yield put({
            type: 'users.unfriendSuccess',
            message: response.message
        });
    } catch (error) {
        yield put({
            type: 'users.unfriendFailure',
            error: error
        });
    }
}

export function* usersBefriendAuthor(action) {
    try {
        console.log("users befriend author");
        const response = yield call(ApiUsers.postFriendRequest, action);
        yield put({
            type: 'users.befriendSuccess',
            response: response
        });
    } catch (error) {
        yield put({
            type: 'users.befriendFailure',
            error: error
        });
    }
}

export function* usersRespondToFriendRequest(action) {
    try {
        console.log("respone to friend request");
        const response = yield call(ApiUsers.postFriendRequestResponse, action);
        yield put({
            type: 'users.respondToFriendRequestSuccess',
            response: response
        });
    } catch (error) {
        yield put({
            type: 'users.respondToFriendRequestFailure',
            response: response
        });
    }
}

export function* usersFetchFriendRequestsList(action) {
    try {
        console.log("get to friend requests");
        const response = yield call(ApiUsers.getFriendRequestsList, action);
        yield put({
            type: 'users.fetchFRListSuccess',
            response: response
        });
    } catch (error) {
        yield put({
            type: 'users.fetchFRListFailure',
            response: response
        });
    }
}
