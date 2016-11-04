/**
 * API Git static class
 */
 import Utils from '../utils/utils.js';

export default class ApiGit {

    static getEvents(action) {
        console.log('GitAPI');
        return fetch('https://api.github.com/users/' + action.username + '/events', {
            method: 'GET'
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static getUser(action) {
        console.log('GitAPI');
        return fetch('https://api.github.com/users/' + action.username, {
            method: 'GET'
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }
}
