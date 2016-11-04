const HOST = "http://192.168.33.10:8000/"
const API = "https://api-bloggyblog404.herokuapp.com/"


export function getApi() {
    if (process.env.NODE_ENV === 'production') {
        return HOST;
    } else {
        return HOST;
    }
}
