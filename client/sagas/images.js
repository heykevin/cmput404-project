import {call, put} from 'redux-saga/effects';

import ApiImages from '../api/images';
import Utils from '../utils/utils.js';

export function* imagesUpload(action) {
    // call the api to log in
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
