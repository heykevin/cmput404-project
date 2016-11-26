import {
    reducerCall
} from './index';


export default function images(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {

    static fetchSuccess(new_state, action) {
        new_state.list = action.response;
        new_state.resolved = true;
        return new_state;
    }

    static fetchFailure(new_state, action) {
        new_state.error = action.error;
        new_state.resolved = true;
        return new_state;
    }

    static uploadSuccess(new_state, action) {
        new_state.sending = false;
        new_state.status = 1;
        return new_state;
    }

    static uploadFailure(new_state, action) {
        new_state.sending = false;
        new_state.status = 0;
        return new_state;
    }

    static startUpload(new_state, action) {
        new_state.sending = true;
        return new_state;
    }

    static clearState(new_state, action) {
        new_state.status = undefined;
        return new_state;
    }
}
