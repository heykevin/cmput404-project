import { reducerCall } from './index';

export default function posts(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static getPostsSuccess(new_state, action)
    {
        new_state.list = action.posts;
        new_state.resolved = true;
        return new_state;
    }

    static getPostsFailure(new_state, action)
    {
        new_state.error = action.error;
        new_state.resolved = true;
        return new_state;
    }

    static savePostSuccess(new_state, action)
    {
        new_state.response = action.response;
        new_state.postData = action.postData;
        new_state.redirect = true;
        return new_state;
    }

    static savePostFailure(new_state, action)
    {
        new_state.error = action.error;
        new_state.postData = action.postData;
        return new_state;
    }

    static modalDeleteShow(new_state, action)
    {
        new_state.modal = new_state.modal ? new_state.modal : {};
        new_state.modal.list_delete = {
            show: true,
            id: action.id,
            title: action.title,
        }
        return new_state;
    }

    static modalDeleteHide(new_state, action)
    {
        new_state.modal.list_delete = {
            show: false,
            id: 0,
            title: "",
        }
        return new_state;
    }

    static deletePostSuccess(new_state, action)
    {
        new_state.modal.list_delete = {
            status: 1
        }
        return new_state;
    }

    static deletePostFailure(new_state, action)
    {
        new_state.modal.list_delete = {
            status: -1
        }
        return new_state;
    }

    static sendingDeleteRequest(new_state, action)
    {
        new_state.modal.list_delete = {
            status: 0
        }
        return new_state;
    }

    static redirectToEditor(new_state, action)
    {
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
}
