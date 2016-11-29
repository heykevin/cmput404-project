/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiComments{

    static addComment(action) {
        console.log("api - save comments");
        const host = getApi(),
            author = Utils.getAuthor(),
            token = Utils.getToken(),
            query = host + "posts/" + action.postId + "/comments/";

        return fetch(query, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: {
                    displayName: author.displayName,
                    host: author.host,
                    id: author.id
                },
                comment: action.content,
                contentType: action.contentType
            })
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

}
