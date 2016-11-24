import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import { usersFetchList, usersFetchFriendsList, usersUnfriendAuthor, usersBefriendAuthor, usersDeclineFriendRequest, usersFetchAuthorProfile } from './users';
import { postsGetPosts, postsSavePost, postsDeletePost, postsEditPostRedirect, postsUpdatePost, postsGetForeignPosts } from './posts';
import { authLogin, authSignup, authLogout, authEdit } from './auth';
import { gitGetEvents, gitGetUser } from './git';
import { imagesUpload, imagesFetch } from './images';

/**
 * Main saga generator
 */
export function* sagas() {
    yield [
        fork(takeLatest, 'usersFetchList', usersFetchList),
        fork(takeLatest, 'usersFetchFriendsList', usersFetchFriendsList),
        fork(takeLatest, 'usersUnfriendAuthor', usersUnfriendAuthor),
        fork(takeLatest, 'usersBefriendAuthor', usersBefriendAuthor),
        //fork(takeLatest, 'usersAcceptFriendRequest', usersAcceptFriendRequest),
        fork(takeLatest, 'usersDeclineFriendRequest', usersDeclineFriendRequest),
        fork(takeLatest, 'usersFetchAuthorProfile', usersFetchAuthorProfile),

        fork(takeLatest, 'postsGetPosts', postsGetPosts),
        fork(takeLatest, 'postsGetForeignPosts', postsGetForeignPosts),
        fork(takeLatest, 'postsSavePost', postsSavePost),
        fork(takeLatest, 'postsUpdatePost', postsUpdatePost),
        fork(takeLatest, 'postsDeletePost', postsDeletePost),
        fork(takeLatest, 'postsEditPostRedirect', postsEditPostRedirect),

        fork(takeLatest, 'authLogin', authLogin),
        fork(takeLatest, 'authSignup', authSignup),
        fork(takeLatest, 'authLogout', authLogout),
        fork(takeLatest, 'authEdit', authEdit),

        fork(takeLatest, 'gitGetEvents', gitGetEvents),
        fork(takeLatest, 'gitGetUser', gitGetUser),

        fork(takeLatest, 'imagesUpload', imagesUpload),
        fork(takeLatest, 'imagesFetch', imagesFetch)
    ];
}
