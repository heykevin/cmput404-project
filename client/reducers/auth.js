import {
    reducerCall
} from './index';
import Utils from '../utils/utils.js';

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

        new_state.author = action.response;
        Utils.setAuthor(action.response);
        new_state.showForm = false;

        console.dir(action);
        console.dir(new_state);
        return new_state;
    }

    static showForm(new_state, action) {
        new_state.showForm = true;
        new_state.author = action.author;
        return new_state;
    }

    static updateFailure(new_state, action) {
        console.log('error', action);
        new_state.error = action;
        console.dir(new_state);
        return new_state;
    }

    static reloadProfile(new_state, action) {
        new_state.resolved = false;
        return new_state;
    }

}
