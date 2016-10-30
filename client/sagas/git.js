import {call, put} from 'redux-saga/effects';

import ApiGit from '../api/git';


export function* gitGetEvents(action) {
    // call the api to log in
    try {
        const response = yield call(ApiGit.getEvents, action);
        // console.log('sagas success', response);
        // Setting auth and redirect to dashboard
        yield put({
            type: 'git.getSuccess',
            response: response
        });
    } catch (error) {
        console.log("Saga caught git get error", error);
        yield put({
            type: 'git.getFailure',
            error: error
        });
    }
}

export function* gitGetUser(action) {
    // call the api to log in
    try {
        const response = yield call(ApiGit.getUser, action);
        // console.log('sagas success', response);
        // Setting auth and redirect to dashboard
        yield put({
            type: 'git.getUserSuccess',
            response: response
        });
    } catch (error) {
        console.log("Saga caught git get user error", error);
        yield put({
            type: 'git.getUserFailure',
            error: error
        });
    }
}
