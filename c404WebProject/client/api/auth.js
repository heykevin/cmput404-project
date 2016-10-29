/**
 * API Auth static class
 */
export default class ApiAuth {
    static handleErrors(response) {
        if (!response.ok) {
            console.log("error", response);
            throw new Error(response.statusText);
        }
        return response.json();
    };

    static login(action) {
        let response = [];
        const encodedLogin = window.btoa(`${action.username}:${action.password}`);

        console.log('LoginAPI');
        // TODO: Create config.js with paths and urls
        return fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedLogin}`
            }
        }).then((response) => {
            return ApiAuth.handleErrors(response);
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

        console.log('signupAPI');
        console.dir(action);
        body.append('displayName', action.username);
        body.append('password', action.password);
        body.append('host', 'http://127.0.0.1:8000/');
        return fetch('http://localhost:8000/author/', {
            method: 'POST',
            body: body
        }).then((response) => {
            return ApiAuth.handleErrors(response);
        }).then((response) => {
            return {
                author: response,
                token: encodedLogin
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
