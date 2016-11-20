/**
 * API Images static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiImages {

    static upload(action) {
        console.log("api - upload images");
        const host = getApi(),
            token = Utils.getToken();
		let body = new FormData();
		body.append('photo', action.photo);

        return fetch(`${host}images/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

	static fetchImages(action) {
		console.log("api - get current author's all images");
		const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}author/images/`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        }).then((response) => {
            return Utils.handleErrors(response);
        });
	}
}
