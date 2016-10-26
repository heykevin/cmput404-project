import { reducerCall } from './index';

export default function posts(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass
{

    static getPostsResolved(new_state, action)
    {
        new_state.list = action.posts;
        new_state.resolved = true;
        return new_state;
    }

    static savePostsResolved(new_state, aciton)
    {
        new_state.response = action.response;
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

    static deletePostResolved(new_state, action)
    {
        for (const index in action.response.data) {
            if (action.response.data[index].id === action.response.id) {
                action.response.data.splice(index, 1);
                break;
            }
        }
        new_state.list = action.response.data;
        new_state.resolved = true;
        console.log("after deletion", new_state.list);
        return new_state;
    }

}
