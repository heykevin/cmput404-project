import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { usersFetchList, usersFetchFriendsList, usersUnfriendAuthor, usersBefriendAuthor, usersRespondToFriendRequest, usersFetchAuthorProfile } from './users';
import { postsGetPosts, postsSavePost, postsDeletePost, postsEditPostRedirect } from './posts';
import { authLogin, authSignup, authLogout, authEdit } from './auth';
import { gitGetEvents, gitGetUser } from './git';

/**
 * Main saga generator
 */
export function* sagas() {
    yield [
        fork(takeLatest, 'usersFetchList', usersFetchList),
        fork(takeLatest, 'usersFetchFriendsList', usersFetchFriendsList),
        fork(takeLatest, 'usersUnfriendAuthor', usersUnfriendAuthor),
        fork(takeLatest, 'usersBefriendAuthor', usersBefriendAuthor),
        fork(takeLatest, 'usersRespondToFriendRequest', usersRespondToFriendRequest),
        fork(takeLatest, 'usersFetchAuthorProfile', usersFetchAuthorProfile),

        fork(takeLatest, 'postsGetPosts', postsGetPosts),
        fork(takeLatest, 'postsSavePost', postsSavePost),
        fork(takeLatest, 'postsDeletePost', postsDeletePost),
        fork(takeLatest, 'postsEditPostRedirect', postsEditPostRedirect),

        fork(takeLatest, 'authLogin', authLogin),
        fork(takeLatest, 'authSignup', authSignup),
        fork(takeLatest, 'authLogout', authLogout),
        fork(takeLatest, 'authEdit', authEdit),

        fork(takeLatest, 'gitGetEvents', gitGetEvents),
        fork(takeLatest, 'gitGetUser', gitGetUser)

    ];
}
