/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiPosts {

    static handleEmptyResponse(response) {
        if (!response.ok) {
            console.log("error", response);
            throw new Error(response.statusText);
        }
        return response;
    }

    static getPosts(action) {
        console.log("get posts api");
        const defaultPageSize = 10,
            host = getApi(),
            token = Utils.getToken();

        let query = "",
            post = [];
        // if the method is author, then it'll be /author/posts or author/{author_id}/posts
        if (action.method == "author") {
            query += action.authorId ? "author/" + action.authorId + "/posts/" : "author/posts/";
        } else {
            query += action.postId ? "posts/" + action.postId : "posts/";
            //query += action.comments ? "/comments" : "";
        }
        console.log(query);
        return fetch(`${host}` + query, {
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
        let body = new FormData();
        const host = getApi(),
            token = Utils.getToken();

        body.append('title', action.postData.title);
        body.append('description', action.postData.description);
        body.append('content', action.postData.content);
        body.append('category', action.postData.category);
        body.append('visibility_choice', action.postData.visibility);
        body.append('content_type', action.postData.contentType);

        // TODO: remove these two once backend API is able to generate these and not requiring these
        body.append('source', `${host}`);
        body.append('origin', `${host}`)
        console.log('api savepost body ', body);
        return fetch(`${host}posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: body
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static deletePost(action) {
        console.log("api - delete post id: " + action.id + '/');
        const host = getApi(),
            token = Utils.getToken();
        return fetch(`${host}posts/` + action.id + '/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${token}`
            }
        }).then((response) => {
            return ApiPosts.handleEmptyResponse(response);
        });
    }
}
