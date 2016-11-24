/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiPosts {

    static composeData(action) {
        let body = new FormData();
        const host = getApi();
        body.append('source', host);
        body.append('content', action.content);
        console.log(body);
        return body;
    }


    static addComment(action) {
        console.log("api - save post");
        const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}posts/{action.postId}/comments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: ApiPosts.composeData(action)
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }
}
