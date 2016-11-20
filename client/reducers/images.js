import {
    reducerCall
} from './index';


export default function images(state = {}, action) {
    return reducerCall(state, action, reducerClass);
}

class reducerClass {
}
