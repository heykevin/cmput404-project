import {call, put} from 'redux-saga/effects';

import ApiImages from '../api/images';
import Utils from '../utils/utils.js';

export function* imagesUpload(action) {
    try {
        const response = yield call(ApiImages.upload, action);

        yield put({
            type: 'images.uploadSuccess',
            response: response.response
        });
    } catch (error) {
        console.log("Saga caught upload iamge error", error);
        yield put({
            type: 'images.uploadFailure',
            error: error
        });
    }
}

export function* imagesFetch(action) {
	// fetch all images posted by current author
    try {
        const response = yield call(ApiImages.fetchImages, action);

        yield put({
            type: 'images.fetchSuccess',
            response: response.response
        });
    } catch (error) {
        console.log("Saga caught fetch images error", error);
        yield put({
            type: 'images.fetchFailure',
            error: error
        });
    }
}
