import axios from "axios";

const ApiClient = () => {
	if (!process.env.REACT_APP_SOCKET_BASE_URL) {
		throw Error("Socket Base URL not found in the .env");
	} else if (!process.env.REACT_APP_SOCKET_API_KEY) {
		throw Error("Socket API Key not found in the .env");
	}

	return axios.create({
		baseURL: process.env.REACT_APP_SOCKET_BASE_URL,
		headers: {
			"Content-type": "application/json",
			"API-KEY": process.env.REACT_APP_SOCKET_API_KEY,
		},
	});
};

export default ApiClient;
