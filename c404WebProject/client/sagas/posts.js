import { call, put } from 'redux-saga/effects';

import ApiPosts from '../api/posts';

export function* postsGetPosts(action) {

    // call the api to get the posts list
    console.log("saga -- Fetch posts")
    const posts = yield call(ApiPosts.getPosts);
    console.log(posts);

    // dispatch the success action with the posts attached
    yield put({
        type: 'posts.getPostsSuccess',
        posts: posts,
    });
}
