const HOST = "http://localhost:8000/"
const API = "https://api-bloggyblog404.herokuapp.com/"


export function getApi() {
    if (process.env.NODE_ENV === 'production') {
        return API;
    } else {
        return HOST;
    }
}
