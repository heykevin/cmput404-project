/**
 * API Auth static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiAuth {

    static login(action) {
        console.log(getApi());
        let response = [];
        const encodedLogin = window.btoa(`${action.username}:${action.password}`);

        const host = getApi();
        // TODO: Create config.js with paths and urls
        return fetch(`${host}login/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedLogin}`
            }
        }).then((response) => {
            return Utils.handleErrors(response);
        }).then((response) => {
            return {
                response: response,
                token: encodedLogin
            };
        });
    }


    static signup(action) {
        let response = [],
            body = new FormData();
        const encodedLogin = window.btoa(`${action.username}:${action.password}`);
        const host = getApi();
        console.log('signupAPI');
        console.dir(action);
        body.append('displayName', action.username);
        body.append('password', action.password);
        body.append('host', 'http://127.0.0.1:8000/');
        return fetch(`${host}author/`, {
            method: 'POST',
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        }).then((response) => {
            return {
                author: response,
                token: encodedLogin
            };
        })
    }
    static updateProfile(action) {
        let response = [],
            body = new FormData();
        const host = getApi();
        console.log('updateAPI');
        console.dir(action);
        const author = Utils.getAuthor();

        body.append('displayName', author.displayName);
        body.append('first_name', action.first_name);
        body.append('last_name', action.last_name);
        body.append('email', action.email);
        body.append('github', action.github);
        body.append('bio', action.bio);
        body.append('host', host);
        body.append('password', author.password);

        console.log('api update body ' + body);
        return fetch(`${host}author/` + author.id + '/', {
            method: 'PUT',
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        }).then((response) => {
            return {
                author: response,
            };
        })
    }

    static logout(action) {
        let response = [];
        sessionStorage.clear();
        // Mock
        return {
            status: 0
        }
    }
}
