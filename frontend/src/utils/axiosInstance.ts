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
	(response) => {
		if (response.status == 200) {
			useAuthStore.setState({ isAuthenticated: true });
		}
		if (response.data?.csrfToken) {
			csrfToken = response.data.csrfToken;
		}
		return response;
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

// In-memory CSRF token (works across different domains)
let csrfToken: string | null = null;

export function setCSRFToken(token: string) {
	csrfToken = token;
}

// Fetch CSRF token from backend if not already present
async function ensureCSRFToken(): Promise<string | null> {
	if (!csrfToken) {
		const res = await axiosLogin.get("/csrf/");
		csrfToken = res.data?.csrfToken ?? null;
	}
	return csrfToken;
}



// Attach CSRF token to headers for axiosRequest
axiosRequest.interceptors.request.use(
	async (config) => {
		const token = await ensureCSRFToken();
		if (token) {
			config.headers["X-CSRFToken"] = token;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Attach CSRF token to headers for axiosLogout
axiosLogout.interceptors.request.use(
	async (config) => {
		const token = await ensureCSRFToken();
		if (token) {
			config.headers["X-CSRFToken"] = token;
		}
		return config;
	},
	(error) => Promise.reject(error)
);
