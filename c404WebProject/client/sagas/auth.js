import {
    call,
    put
} from 'redux-saga/effects';
import {
    browserHistory
} from 'react-router';

import ApiAuth from '../api/auth';


export function* authLogin(action) {

    // call the api to log in
    console.log("saga -- auth Login")
    const response = yield call(ApiAuth.login);

    // dispatch the success action with the log in response attached
    yield put({
        type: 'auth.getResponseSuccess',
        response: response
    });

    setAuthAndRedirectDashboard();
}

export function* authSignup(action) {

    console.log("saga -- auth Sign up")
    const response = yield call(ApiAuth.signup);
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

function setAuthAndRedirectDashboard() {
    sessionStorage.setItem("loggedIn", 1);
    browserHistory.push('/dashboard'); // Go to dashboard page
}
