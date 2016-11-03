/**
 * API Users static class
 */
import Utils from '../utils/utils.js';

export default class ApiUsers {

    static getAuthorProfile(action) {
        return fetch('http://localhost:8000/author/' + action.authorId).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static getUsers(action) {
        return fetch('http://localhost:8000/author/').then((response) => {
            return Utils.handleErrors(response);
        }).then((list) => {
            return list;
        });
    }

    static getFriendsIds(action) {
        return fetch('http://localhost:8000/friends/' + action.authorId).then((response) => {
            return Utils.handleErrors(response);
        }).then((list) => {
            return list.authors;
        });
    }

    static postUnfriendRequest(action) {
        return fetch('http://localhost:8000/friendrequest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    query: "unfriend",
                    author: action.actor,
                    friend: action.target
                })
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static postFriendRequest(action) {
        const body = JSON.stringify({
                query: "friendrequest",
                author: action.actor,
                friend: action.target
            });
        return fetch('http://localhost:8000/friendrequest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static postFriendRequestResponse(action) {
        const body = JSON.stringify({
                query: "friendresponse",
                author: action.actor,
                friend: action.target,
                accepted: action.accepted
        });
        console.log(body);
        return fetch('http://localhost:8000/friendrequest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }
}
