/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import { getApi } from '../config.js';

export default class ApiPosts {
    static getPosts(action) {
        console.log("posts api");
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
        return {
            status: 201
        }
    }

    static deletePost(action) {
        console.log("api - delete post id: " + action.id);
        return {
            data: data,
            id: action.id
        };
    }
}
