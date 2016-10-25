import { reducerCall } from './index';

export default function posts(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static getPostsResolved(new_state, action)
    {
        new_state.list = action.posts;
        return new_state;
    }

    static savePostsResolved(new_state, aciton)
    {
        new_state.response = action.response;
        new_state.postData = action.postData;
        return new_state;
    }
}
