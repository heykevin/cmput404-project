import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { usersFetchList, usersAdd, usersEdit, usersDelete } from './users';
import { postsGetPosts, postsSavePost, postsDeletePost, postsEditPostRedirect } from './posts';
import { authLogin, authSignup, authLogout } from './auth';
import { gitGetEvents, gitGetUser } from './git';

/**
 * Main saga generator
 */
export function* sagas() {
    yield [
        fork(takeLatest, 'usersFetchList', usersFetchList),
        fork(takeLatest, 'usersAdd', usersAdd),
        fork(takeLatest, 'usersEdit', usersEdit),
        fork(takeLatest, 'usersDelete', usersDelete),

        fork(takeLatest, 'postsGetPosts', postsGetPosts),
        fork(takeLatest, 'postsSavePost', postsSavePost),
        fork(takeLatest, 'postsDeletePost', postsDeletePost),
        fork(takeLatest, 'postsEditPostRedirect', postsEditPostRedirect),

        fork(takeLatest, 'authLogin', authLogin),
        fork(takeLatest, 'authSignup', authSignup),
        fork(takeLatest, 'authLogout', authLogout),

        fork(takeLatest, 'gitGetEvents', gitGetEvents),
        fork(takeLatest, 'gitGetUser', gitGetUser)

    ];
}
