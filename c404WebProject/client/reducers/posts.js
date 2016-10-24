import { reducerCall } from './index';

export default function posts(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static getPostsSuccess(new_state, action)
    {
        console.log("posts reducer and following new state: ");
        console.dir(new_state);
        new_state.list = action.posts;
        return new_state;
    }
}
