import {
    call,
    put
} from 'redux-saga/effects';

import ApiUsers from '../api/users';

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
