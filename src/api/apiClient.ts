import axios from "axios";

const ApiClient = () => {
	return axios.create({
		baseURL: process.env.REACT_APP_SOCKET_BASE_URL,
		headers: {
			"Content-type": "application/json",
			"API-KEY": process.env.REACT_APP_SOCKET_API_KEY,
		},
	});
};

export default ApiClient;
