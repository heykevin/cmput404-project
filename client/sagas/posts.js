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
            posts: posts.posts,
            count: posts.count ? posts.count : 1
        });
    } catch (error) {
        yield put({
            type: 'posts.getPostsFailure',
            error: error,
        });
    }
}

export function* postsGetForeignPosts(action) {
    try {
        // call the api to get the posts list
        console.log("saga -- Fetch posts");
        const posts = yield call(ApiPosts.getForeignPosts, action);
        // dispatch the success action with the posts attached
        yield put({
            type: 'posts.getForeignPostsSuccess',
            posts: posts.posts,
            count: posts.count ? posts.count : 1
        });
    } catch (error) {
        yield put({
            type: 'posts.getForeignPostsFailure',
            error: error,
        });
    }
}
export function* postsSavePost(action) {
    console.log("sage -- save post");
    // dispatch success action with response and also action.postData in
    // case the response indicates a save failure and we need to restore
    // the user's data
    try {
        const response = yield call(ApiPosts.savePost, action);
        yield put({
            type: 'posts.savePostSuccess',
            response: response,
            postData: action.postData
        });
    } catch (error) {
        console.log("Saga caught save post error", error);
        yield put({
            type: 'posts.savePostFailure',
            error: error,
            postData: action.postData,
        });
    }
}

export function* postsDeletePost(action) {
    console.log("sage -- delete post");
    try {
        const response = yield call(ApiPosts.deletePost, action);
        yield put({
            type: 'posts.deletePostSuccess',
            response: response
        });
    } catch (error) {
        yield put({
            type: 'posts.deletePostFailure',
            error: error
        });
    }
}

export function* postsUpdatePost(action) {
    try {
        const response = yield call(ApiPosts.updatePost, action);
        yield put({
            type: 'posts.savePostSuccess',
            response: response,
            postData: action.postData
        });
    } catch (error) {
        yield put({
            error: error,
            postData: action.postData
        });
    }
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
