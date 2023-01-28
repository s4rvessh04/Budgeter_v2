import axios from "axios";

import { useAuthStore } from "../stores";

const BASEURL = "http://localhost:8000";

const parseBaseUrl = (path: string) => BASEURL.concat(path.trim());

export const axiosLogin = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
	withCredentials: true,
});

axiosLogin.interceptors.response.use(
	(config) => {
		if (config.status == 200) {
			useAuthStore.setState({ isAuthenticated: true });
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const axiosLogout = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "X-CSRFToken",
});

axiosLogout.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosLogout.interceptors.response.use(
	(config) => {
		useAuthStore.setState({ isAuthenticated: false });
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const axiosRequest = axios.create({
	baseURL: parseBaseUrl("/api"),
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "X-CSRFToken",
});

axiosRequest.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosRequest.interceptors.response.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
