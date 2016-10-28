import {call, put} from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import ApiAuth from '../api/auth';


export function* authLogin(action) {
    // call the api to log in
    try {
        const response = yield call(ApiAuth.login, action);
        // console.log('sagas success', response);
        // Setting auth and redirect to dashboard
        yield put({
            type: 'auth.loginSuccess',
            response: response
        });
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("author", response.author);
        browserHistory.push('/dashboard');
    } catch(error) {
        console.log("Saga caught login error", error);
        yield put({
            type: 'auth.loginFailure',
            error: error
        });
    }
}

export function* authSignup(action) {

    console.log("saga -- auth Sign up")
    const response = yield call(ApiAuth.signup, action);
    setAuthAndRedirectDashboard();
    yield put({
        type: 'auth.getResponseSuccess',
        response: response
    });
}

export function* authLogout(action) {

    console.log("saga -- auth Log out")
    const response = yield call(ApiAuth.logout);
    sessionStorage.clear();
    yield put({
        type: 'auth.getResponseSuccess',
        response: response
    });
    browserHistory.push('/');
}
