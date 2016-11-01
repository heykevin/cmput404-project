import {
    browserHistory
} from 'react-router';
import {
    reducerCall
} from './index';


export default function auth(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {
    static loginSuccess(new_state, action) {
        // console.log(action);
        // console.log("login reducer success ");
        // console.dir(new_state);
        new_state = action.response.author;
        new_state.login = true;
        new_state.attempt = true;
        return new_state;
    }

    static loginFailure(new_state, action) {
        // console.log("Login failed");
        // new_state = action.author;
        console.log('error', action);
        new_state.login = false;
        new_state.attempt = true;
        new_state.error = action;
        console.dir(new_state);
        return new_state;
    }

    static signupSuccess(new_state, action) {
        new_state = action.response;
        new_state.login = true;
        // new_state.attempt = true;

        console.dir(action);
        console.dir(new_state);
        return new_state;
    }

    static signupFailure(new_state, action) {
        console.log('error', action);
        new_state.login = false;
        new_state.error = action;
        console.dir(new_state);
        return new_state;
    }

    static updateSuccess(new_state, action) {
        new_state = action.response;
        new_state.displayName = action.displayName,
        new_state.first_name = action.first_name,
        new_state.last_name = action.last_name,
        new_state.email = action.email,
        new_state.github_username = action.github_username,
        new_state.bio =action.bio
        console.dir(action);
        console.dir(new_state);
        return new_state;
    }

    static signupFailure(new_state, action) {
        console.log('error', action);
        new_state.error = action;
        console.dir(new_state);
        return new_state;
    }

}
