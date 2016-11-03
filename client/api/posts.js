/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiPosts {

    static getPosts(action) {
        console.log("get posts api");
        const defaultPageSize = 10,
            host = getApi(),
            token = Utils.getToken();

        let query = host,
            post = [];
            console.log(host);
        // if the method is author, then it'll be /author/posts or author/{author_id}/posts
        if (action.method == "author") {
            query += action.authorId ? "author/" + action.authorId + "/posts/" : "author/posts/";
        } else {
            query += action.postId ? "posts/" + action.postId : "posts/";
            //query += action.comments ? "/comments" : "";
        }
        console.log(query);
        return fetch(query, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        }).then((res) => {
            return Utils.handleErrors(res);
        }).then((response) => {
            return response.posts;
        });
    }

    static savePost(action) {
        console.log("api - save post");
        // add Authorization
        // refer to auth.js
        let response = []
        let body = new FormData();
        const host = getApi(),
            token = Utils.getToken();

        //id
        body.append('title', action.postData.title);
        body.append('source', host);
        body.append('origin', host);
        body.append('description', action.postData.description);
        body.append('content', action.postData.content);
        body.append('category', action.postData.category);
        body.append('visibility_choice', action.postData.visibility);
        body.append('content_type', 'text/markdown');

        // TODO: Create config.js with paths and urls
        console.log('api savepost body ' + body);
        return fetch(`${host}posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        }).then((response) => {
            return {
                response: response,
                token: token
            };
        });
    }
    //     return {
    //         status: 201
    //     }
    // }

    static deletePost(action) {
        console.log("api - delete post id: " + action.id);
        return {
            data: data,
            id: action.id
        };
    }
}
