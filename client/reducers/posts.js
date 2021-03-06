import {
    reducerCall
} from './index';

export default function posts(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {

    static getPostsSuccess(new_state, action) {
        new_state.list = (action.posts && action.posts.length) ? this.sortPostsByDate(action.posts) : action.posts;
        new_state.count = action.count;
        new_state.resolved = true;
        return new_state;
    }

    static getPostsFailure(new_state, action) {
        new_state.error = action.error;
        new_state.resolved = true;
        return new_state;
    }

    static getForeignPostsSuccess(new_state, action) {
        new_state.foreignList = (action.posts && action.posts.length) ? this.sortPostsByDate(action.posts) : action.posts;
        new_state.foreignCount = action.count;
        new_state.foreignResolved = true;
        return new_state;
    }

    static getForeignPostsFailure(new_state, action) {
        new_state.error = action.error;
        new_state.foreignResolved = true;
        return new_state;
    }

    static savePostSuccess(new_state, action) {
        new_state.response = action.response;
        new_state.postData = action.postData;
        new_state.redirect = true;
        return new_state;
    }

    static savePostFailure(new_state, action) {
        new_state.saveError = action.error;
        new_state.postData = action.postData;
        return new_state;
    }

    static modalDeleteShow(new_state, action) {
        new_state.modal = new_state.modal ? new_state.modal : {};
        new_state.modal.list_delete = {
            show: true,
            id: action.id,
            title: action.title,
        }
        return new_state;
    }

    static modalDeleteHide(new_state, action) {
        new_state.modal.list_delete = {
            show: false,
            id: 0,
            title: "",
        }
        return new_state;
    }

    static deletePostSuccess(new_state, action) {
        new_state.modal.list_delete = {
            status: 1
        }
        return new_state;
    }

    static deletePostFailure(new_state, action) {
        new_state.modal.list_delete = {
            status: -1
        }
        return new_state;
    }

    static sendingDeleteRequest(new_state, action) {
        new_state.modal.list_delete = {
            status: 0
        }
        return new_state;
    }

    static redirectToEditor(new_state, action) {
        const posts = new_state.list;
        new_state.isEditMode = true;

        if (posts) {
            for (const post of posts) {
                if (post.id === action.id) {
                    new_state.postInEdit = post;
                    new_state.shouldRequestPost = false;
                    return new_state;
                }
            }
        }

        new_state.id = action.id;
        new_state.shouldRequestPost = true;
        new_state.resolved = false;
        return new_state;
    }

    static clearEditorRelatedState(new_state, action) {
        new_state.redirect = false;
        new_state.id = undefined;
        new_state.response = undefined;
        new_state.postData = undefined;
        new_state.resolved = undefined;
        return new_state;
    }

    static reloadList(new_state, action) {
        new_state.resolved = false;
        new_state.foreignResolved = false;

        new_state.list = [];
        new_state.foreignList = [];
        return new_state;
    }

    static sortPostsByDate(posts) {
        posts.sort(function(a, b) {
            return new Date(b.published).getTime() - new Date(a.published).getTime();
        });
        return posts;
    }
}
