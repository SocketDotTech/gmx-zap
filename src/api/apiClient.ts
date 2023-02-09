import axios from "axios";

const BASE_URL: string = "https://api.socket.tech/v2";

const ApiClient = () => {
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			"Content-type": "application/json",
			"API-KEY": process.env.REACT_APP_SOCKET_API_KEY,
		},
	});
};

export default ApiClient;
