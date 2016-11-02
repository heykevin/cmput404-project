import { call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import ApiPosts from '../api/posts';

export function* postsGetPosts(action) {
    try {
        // call the api to get the posts list
        console.log("saga -- Fetch posts");
        const posts = yield call(ApiPosts.getPosts, action);
        // dispatch the success action with the posts attached
        yield put({
            type: 'posts.getPostsSuccess',
            posts: posts,
        });
    } catch (error) {
        yield put({
            type: 'posts.getPostsFailure',
            error: error,
        });
    }
}

export function* postsSavePost(action) {
    console.log("sage -- save post");
    const response = yield call(ApiPosts.savePost, action);

    // dispatch success action with response and also action.postData in
    // case the response indicates a save failure and we need to restore
    // the user's data
    yield put({
        type: 'posts.savePostResolved',
        response: response,
        postData: action.postData
    });
}

export function* postsDeletePost(action) {
    console.log("sage -- delete post");
    const response = yield call(ApiPosts.deletePost, action);

    yield put({
        type: 'posts.deletePostResolved',
        response: response
    });
}

export function* postsEditPostRedirect(action) {
    console.log("sage -- edit post");
    browserHistory.push("/editpost");
    yield put({
        type: 'posts.redirectToEditor',
        id: action.id,
        isEditMode: true
    });
}
