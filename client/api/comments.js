/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiComments{

    static composeData(action) {
        let body = new FormData();
        const host = getApi();
        body.append('host', host);
        body.append('comment', action.content);
        body.append('author', action.author);
        console.log("Body of comment in api compose --> " + action.content);
        return body;
    }


    static addComment(action) {
        console.log("api - save comments");
        const host = getApi(),
            token = Utils.getToken(),
            query = host + "posts/" + action.postId + "/comments/";

        return fetch(query, {
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
            token = Utils.getToken(),
            query = host + "posts/" + action.postId + "/comments/";

            console.log("Double check you query --> " + query);

            let comments = [];

        return fetch(query, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        }).then((res) => {
            return Utils.handleErrors(res);
        }).then((response) => {
            return {comments: response.comments}
        });
    }

    static handleEmptyResponse(response) {
        if (!response.ok) {
            console.log("error", response);
            throw new Error(response.statusText);
        }
        return response;
    }

}
