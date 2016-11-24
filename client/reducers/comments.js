import { reducerCall } from './index';

export default function comments(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{
    static addCommentSuccess(new_state, action)
    {
        console.log("reducer add comment");
        new_state.response = action.response;
        return new_state;
    }

    static addCommentFailure(new_state, action)
    {
        new_state.error = action.error;
        return new_state;
    }
}
