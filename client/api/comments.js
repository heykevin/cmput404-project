/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiComments{

    static composeData(action) {
        let body = new FormData();
        const host = getApi();
        body.append('content', action.content);
        console.log(body);
        return body;
    }


    static addComment(action) {
        console.log("api - save comments");
        const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}posts/{action.postId}/comments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: ApiComments.composeData(action)
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static getComment(action) {
        console.log("api - get comment");
        const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}posts/{action.postId}/comments/`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }
}
