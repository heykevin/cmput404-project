import {
    reducerCall
} from './index';

import Utils from '../utils/utils.js';

export default function users(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {

    static befriendFailure(new_state, action) {
        new_state.sending = false;
        new_state.authorResolved = false;
        new_state.error = action.error;
        new_state.toastMessage = "Oops! Something went wrong. Please try again later.";
        return new_state;
    }

    static befriendSuccess(new_state, action) {
        new_state.sending = false;
        new_state.authorResolved = false;
        new_state.response = action.response;
        new_state.toastMessage = "Your friend request has been sent. ε٩(๑> ₃ <)۶з";
        return new_state;
    }

    static unfriendFailure(new_state, action) {
        new_state.sending = false;
        new_state.authorResolved = false;
        new_state.error = action.error;
        new_state.toastMessage = "Oops! Something went wrong. _(┐「ε:)_ Please try again later.";
        return new_state;
    }

    static unfriendSuccess(new_state, action) {
        new_state.sending = false;
        new_state.authorResolved = false;
        new_state.response = action.response;
        new_state.toastMessage = "Congrats, that guy is no long your friend. ╮(╯_╰)╭";
        return new_state;
    }

    static fetchUsersSuccess(new_state, action) {
        new_state.users = this.sortUsersByDisplayName(action.users);
        new_state.usersResolved = true;
        return new_state;
    }

    static fetchUsersFailure(new_state, action) {
        new_state.error = new_state.error;
        new_state.usersResolved = true;
        return new_state;
    }

    static fetchFriendsSuccess(new_state, action) {
        new_state.friends = this.sortUsersByDisplayName(action.friends);
        new_state.friendsResolved = true;
        return new_state;
    }

    static fetchFriendsFailure(new_state, action) {
        new_state.error = new_state.error;
        new_state.friendsResolved = true;
        return new_state;
    }

    static fetchAuthorProfileSuccess(new_state, action) {
        new_state.author = action.profile;
        new_state.authorResolved = true;
        new_state.sending = undefined;
        // not safe, need to double check id and such, should be improved later
        Utils.setAuthor(action.profile);
        return new_state;
    }

    static fetchAuthorProfileFailure(new_state, action) {
        new_state.authorError = action.error;
        new_state.authorResolved = true;
        new_state.sending = undefined;
        return new_state;
    }

    static sendingRequest(new_state, action) {
        new_state.sending = true;
        new_state.targetId = action.requestId;
        return new_state;
    }

    static respondToFriendRequestSuccess(new_state, action) {
        new_state.sending = false;
        new_state.authorResolved = false;
        new_state.response = action.response;
        return new_state;
    }

    static respondToFriendRequestFailure(new_state, action) {
        new_state.sending = false;
        new_state.error = action.error;
        return new_state;
    }

    static sortUsersByDisplayName(userList) {
        userList.sort(function(a, b) {
            return a.displayName.localeCompare(b.displayName);
        });
        return userList;
    }
}
