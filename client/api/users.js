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
        let users = [];
        return fetch('http://localhost:8000/author/').then((response) => {
            return Utils.handleErrors(response);
        }).then((list) => {
            console.log(list);
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
}
