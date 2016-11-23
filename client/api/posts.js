/**
 * API Posts static class
 */
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export default class ApiPosts {

    static composeData(action) {
        let body = new FormData();
        const host = getApi();
        body.append('title', action.postData.title);
        body.append('source', host);
        body.append('description', action.postData.description);
        body.append('content', action.postData.content);
        body.append('category', action.postData.category);
        body.append('visibility', action.postData.visibility);
        body.append('contentType', action.postData.contentType);
        console.log(body);
        return body;
    }

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

        let query = `${host}`,
            post = [];
        // if the method is author, then it'll be /author/posts or author/{author_id}/posts
        if (action.method == "author") {
            query += action.authorId ? "author/" + action.authorId + "/posts/" : "author/posts/";
        } else {
            query += action.postId ? "posts/" + action.postId  + '/' : "posts/";
            //query += action.comments ? "/comments" : "";
        }

        if (action.page) {
            query += "?page=" + action.page;
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
            return {posts: response.posts, count: response.count};
        });
    }

    static getForeignPosts(action) {
        console.log("get posts api");
        const token = "YWRtaW46Y21wdXQ0MDQ=";

        let query = "http://cmput404f16t04dev.herokuapp.com/api/posts/";
        return fetch(query, {
            method: 'GET',
            headers: {
                'Authorization': `Basic YWRtaW46Y21wdXQ0MDQ=`
            }
        }).then((res) => {
            return Utils.handleErrors(res);
        }).then((response) => {
            return {posts: response.posts, count: response.count};
        });
    }

    static savePost(action) {
        console.log("api - save post");
        const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: ApiPosts.composeData(action)
        }).then((response) => {
            return Utils.handleErrors(response);
        });
    }

    static updatePost(action) {
        const host = getApi(),
            token = Utils.getToken();

        return fetch(`${host}posts/` + action.postData.id + '/', {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${token}`
            },
            body: ApiPosts.composeData(action)
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
