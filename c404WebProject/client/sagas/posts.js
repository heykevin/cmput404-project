import { call, put } from 'redux-saga/effects';

import ApiPosts from '../api/posts';

export function* postsGetPosts(action) {

    // call the api to get the posts list
    console.log("saga -- Fetch posts");
    const posts = yield call(ApiPosts.getPosts, action);
    console.log(posts);

    // dispatch the success action with the posts attached
    yield put({
        type: 'posts.getPostsSuccess',
        posts: posts,
    });
}

export function* postsSavePost(action) {
    console.log("sage -- save post");
    const response = yield call(ApiPosts.savePost);
}
