import { reducerCall } from './index';

export default function comments(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{
    static submittingComment(new_state, action)
    {
        new_state.sending = true;
        new_state.success = undefined;
        return new_state;
    }

    static addCommentSuccess(new_state, action)
    {
        console.log("reducer add comment");
        new_state.sending = false;
        new_state.success = true;
        return new_state;
    }

    static addCommentFailure(new_state, action)
    {
        new_state.sending = false;
        new_state.success = false;
        return new_state;
    }

    static clearState(new_state, action)
    {
        return {};
    }
}
