import { call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import ApiComments from '../api/comments';

export function* commentsAddComment(action) {
    try {
        console.log("saga -- add comment");
        const posts = yield call(ApiComments.addComment, action);
        // dispatch the success action with the posts attached
        console.log("Add comment saga success");
        yield put({
            type: 'comments.addCommentSuccess',
        });
    } catch (error) {
        yield put({
            type: 'comments.addCommentFailure',
            error: error,
        });
    }
}
