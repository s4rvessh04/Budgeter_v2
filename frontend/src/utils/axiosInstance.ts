import axios from "axios";

import { useAuthStore } from "../stores";

const BASEURL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:8000";

const parseBaseUrl = (path: string) => BASEURL.concat(path.trim());

export const axiosLogin = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "X-CSRFToken",
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

// Helper to get cookie value
function getCookie(name: string) {
	if (!document.cookie) {
		return null;
	}

	const xsrfCookies = document.cookie
		.split(";")
		.map((c) => c.trim())
		.filter((c) => c.startsWith(name + "="));

	if (xsrfCookies.length === 0) {
		return null;
	}
	return decodeURIComponent(xsrfCookies[0].split("=")[1]);
}

// Manually attach CSRF token to headers for axiosRequest
axiosRequest.interceptors.request.use(
	(config) => {
		const token = getCookie("csrftoken");
		if (token) {
			// @ts-ignore
			config.headers["X-CSRFToken"] = token;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Manually attach CSRF token to headers for axiosLogout
axiosLogout.interceptors.request.use(
	(config) => {
		const token = getCookie("csrftoken");
		if (token) {
			// @ts-ignore
			config.headers["X-CSRFToken"] = token;
		}
		return config;
	},
	(error) => Promise.reject(error)
);
