import { browserHistory } from 'react-router';

export default class Utils {

	static redirect(url) {
		browserHistory.push(url);
	}

	static getToken() {
		return sessionStorage.token;
	}

	static getAuthor() {
		return JSON.parse(sessionStorage.author);
	}

}
