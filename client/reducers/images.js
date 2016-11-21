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

    }

    static uploadFailure(new_state, action) {
        
    }
}
