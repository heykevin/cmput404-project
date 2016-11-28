/**
 * API Users static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiUsers {

    static getAuthorProfile(action) {
        const host = getApi();
        return fetch(`${host}author/` + action.authorId + "/").then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static getUsers(action) {
        const host = getApi();
        return fetch(`${host}author/`).then((response) => {
            return Utils.handleErrors(response);
        }).then((list) => {
            return list;
        });
    }

    static getFriendsIds(action) {
        const host = getApi();
        return fetch(`${host}friends/` + action.authorId + "/").then((response) => {
            return Utils.handleErrors(response);
        }).then((list) => {
            return list.authors;
        });
    }

    static postUnfriendRequest(action) {
        const host = getApi();
        return fetch(`${host}friendrequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    query: "unfriend",
                    author: action.target,
                    friend: action.actor
                })
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static postFriendRequest(action) {
        const host = getApi();
        const body = JSON.stringify({
                query: "friendrequest",
                author: action.target,
                friend: action.actor
            });
        return fetch(`${host}friendrequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static declinetFriendRequest(action) {
        const host = getApi();
        const body = JSON.stringify({
                query: "rejectrequest",
                author: action.target,
                friend: action.actor,
        });

        console.log(body);
        return fetch(`${host}friendrequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static syncRemoteFriends() {
        const host = getApi(),
            token = Utils.getToken();

        return fetch (`${host}friendsync/`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        });
    }
}
