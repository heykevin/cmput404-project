import { reducerCall } from './index';
import { browserHistory } from 'react-router';

export default function auth(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static getResponseSuccess(new_state, action)
    {
        console.log("auth reducer and following new state: ");
        console.dir(new_state);
        new_state.status = action.response.status;
        return new_state;
    }
}
