import { reducerCall } from './index';
import { browserHistory } from 'react-router';

export default function auth(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static loginSuccess(new_state, action) {
        console.log("auth reducer and following new state: ");
        new_state = action.author;
        console.dir(new_state);
        return new_state;
    }

    static loginFailure(new_state, action) {
        console.log("Login failed");
        new_state = action.author;
        console.dir(new_state);
        return new_state;
    }
}
