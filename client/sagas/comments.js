import { call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import ApiComments from '../api/comments';

export function* commentsAddComment(action) {
    try {
        console.log("saga -- add comment");
        const posts = yield call(ApiComments.addComment, action);
        console.log("Add comment saga success");
        yield put({
            type: 'comments.addCommentSuccess',
            response: repsonse,
            content: action.content
        });
    } catch (error) {
        yield put({
            type: 'comments.addCommentFailure',
            error: error,
            content: action.content
        });
    }
}

export function* commentsGetComment(action) {
    try {
        console.log("saga -- get comment");
        const posts = yield call(ApiComments.getComment, action);
        console.log("get comment saga success");
        yield put({
            type: 'comments.getCommentSuccess',
            comments: comments.comments,
        });
    } catch (error) {
        yield put({
            type: 'comments.getCommentFailure',
            error: error,
        });
    }
}
