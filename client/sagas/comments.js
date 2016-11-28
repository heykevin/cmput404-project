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

// export function* commentsGetComment(action) {
//     try {
//         console.log("saga -- get comment", action);
//         const comments = yield call(ApiComments.getComment, action);
//         yield put({
//             type: 'comments.getCommentSuccess',
//             comments: comments,
//             postId: action.postId
//     });
//     } catch (error) {
//         yield put({
//             type: 'comments.getCommentFailure',
//             error: error,
//         });
//     }
// }
