import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { usersFetchList, usersAdd, usersEdit, usersDelete } from './users';
import { postsGetPosts } from './posts';
import { authLogin, authSignup, authLogout } from './auth';

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
        fork(takeLatest, 'authLogin', authLogin),
        fork(takeLatest, 'authSignup', authSignup),
        fork(takeLatest, 'authLogout', authLogout),
    ];
}
