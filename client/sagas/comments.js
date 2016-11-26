import { call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import ApiComments from '../api/comments';

export function* commentsAddComment(action) {
    try {
        console.log("saga -- add comment");
        const comments = yield call(ApiComments.addComment, action);
        yield put({
            type: 'comments.addCommentSuccess',
            content: action.content
        });
    } catch (error) {
        console.log("error -- > ", error);
        yield put({
            type: 'comments.addCommentFailure',
            error: error,
            content: action.content,
        });
    }
}

export function* commentsGetComment(action) {
    try {
        console.log("saga -- get comment", action);
        const comments = yield call(ApiComments.getComment, action);
        console.log("get comment saga success");
        console.log("Saga comments --> ", comments);
        console.log("Saga comments.comments --> ", comments.comments);
        yield put({
            type: 'comments.getCommentSuccess',
            comments: comments.comments
    });
    } catch (error) {
        console.log("get comments fail");
        console.log("error -- > ", error);
        yield put({
            type: 'comments.getCommentFailure',
            error: error,
        });
    }
}
