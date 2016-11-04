
import {
    reducerCall
} from './index';


export default function auth(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {
    static getSuccess(new_state, action) {
		new_state.events = action.response;
        new_state.resolved = true;
        return new_state;
	}

    static getFailure(new_state, action) {
		new_state.response = action.response;
        new_state.resolved = true;
        return new_state;
    }

    static getUserSuccess(new_state, action) {
        new_state.user = action.response;
        return new_state;
    }

    static getUserFailure(new_state, action) {
        new_state.response = action.response;
        return new_state;
    }
}
