/**
 * API Auth static class
 */
export default class ApiAuth
{
    static handleErrors(response) {
        if (!response.ok) {
            console.log("error", response);
            throw new Error(response.statusText);
        }
        return response.json();
    };

    static login(action) {
        let response = [];
        console.log('LoginAPI');
        const encodedLogin = window.btoa(`${action.username}:${action.password}`)
        // TODO: Create config.js with paths and urls
        return fetch('http://192.168.33.10:8000/login/', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedLogin}`
            }
        }).then((response) => {
            return ApiAuth.handleErrors(response);
        }).then((author) => {
            return author;
        })
    }
    

	static signup(action)
	{
		let response = [];

		// Mock
		return {
			status: 1
		}
	}

    static logout(action)
    {
        let response = [];

        // Mock
        return {
            status: 0
        }
    }
}