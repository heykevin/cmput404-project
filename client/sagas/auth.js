import {call, put} from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import ApiAuth from '../api/auth';

function setAuthAndRedirect(token, author) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("author", JSON.stringify(author));
    browserHistory.push('/dashboard');
}

export function* authLogin(action) {
    // call the api to log in
    try {
        const response = yield call(ApiAuth.login, action);
        // console.log('sagas success', response);
        // Setting auth and redirect to dashboard
        yield put({
            type: 'auth.loginSuccess',
            response: response.response
        });
        setAuthAndRedirect(response.token, response.response.author);
    } catch (error) {
        console.log("Saga caught login error", error);
        yield put({
            type: 'auth.loginFailure',
            error: error
        });
    }
}

export function* authSignup(action) {

    try {
        const response = yield call(ApiAuth.signup, action);
        yield put({
            type: 'auth.signupSuccess',
            response: response.author
        });
        setAuthAndRedirect(response.token, response.author);
    } catch (error) {
        console.log("Saga caught signup error", error);
        yield put({
            type: 'auth.signupFailure',
            error: error
        });
    }
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

export function* authEdit(action) {

    try {
        const response = yield call(ApiAuth.updateProfile, action);
        yield put({
            type: 'auth.updateSuccess',
            response: response.author
        });
        setAuthAndRedirect(response.token, response.author);
    } catch (error) {
        console.log("Saga caught signup error", error);
        yield put({
            type: 'auth.updateFailure',
            error: error
        });
    }
}
