import { reducerCall } from './index';

export default function comments(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{
    static addCommentSuccess(new_state, action)
    {
        console.log("reducer add comment");
        new_state.content = action.content;
        new_state.response = action.response;
        return new_state;
    }

    static addCommentFailure(new_state, action)
    {
        new_state.error = action.error;
        new_state.response = action.response;
        return new_state;
    }

    static getCommentSuccess(new_state, action)
    {
        console.log("reducer get comment", action);
        new_state.response = action.response;
        new_state.list = (action.comments && action.comments.length) ? this.sortCommentsByDate(action.comments) : action.comments;
        return new_state;
    }

    static getCommentFailure(new_state, action)
    {
        new_state.error = action.error;
        new_state.response = action.response;
        return new_state;
    }

    static reloadList(new_state, action)
    {
        new_state.resolved = false;
        new_state.list = [];
        return new_state;
    }

    static sortCommentsByDate(comments)
    {
        comments.sort(function(a, b) {
            return new Date(b.published).getTime() - new Date(a.published).getTime();
        });
        return comments;
    }
}
