import axios from "axios";
import { Cookies } from "react-cookie";

import { useAuthStore } from "../stores";

const cookies = new Cookies();
const BASEURL = "http://localhost:8000";

const parseBaseUrl = (path: string) => BASEURL.concat(path.trim());

let token: string = cookies.get("token");
let logged_in: boolean = cookies.get("logged_in");

export const axiosAuth = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
	headers: {
		Authorization: `Token ${token}`,
	},
});

axiosAuth.interceptors.request.use(
	(config) => {
		if (!token) {
			token = cookies.get("token");
			config.headers!.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		cookies.set("logged_in", false, { path: "/", sameSite: "lax" });
		cookies.remove("token");
		return Promise.reject(error);
	}
);

axiosAuth.interceptors.response.use(
	(config) => {
		return config;
	},
	(error) => {
		if (error.response.status == 401) {
			cookies.set("logged_in", false, { path: "/", sameSite: "lax" });
			cookies.remove("token", { path: "/", sameSite: "lax" });
		}
		return Promise.reject(error);
	}
);

export const axiosLogin = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
});

axiosLogin.interceptors.response.use(
	(config) => {
		if (config.status == 200) {
			useAuthStore.setState({ isAuthenticated: true });
			cookies.set("token", config.data.token, {
				path: "/",
				sameSite: "lax",
			});
			cookies.set("logged_in", true, { path: "/", sameSite: "lax" });
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const axiosLogout = axios.create({
	baseURL: parseBaseUrl("/api/auth"),
	headers: {
		Authorization: `Token ${token}`,
	},
});

axiosLogout.interceptors.request.use(
	(config) => {
		token = cookies.get("token");
		config.headers!.Authorization = `Token ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosLogout.interceptors.response.use(
	(config) => {
		cookies.remove("token", { path: "/", sameSite: "lax" });
		cookies.set("logged_in", false, { path: "/", sameSite: "lax" });
		useAuthStore.setState({ isAuthenticated: false });
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const axiosRequest = axios.create({
	baseURL: parseBaseUrl("/api"),
	headers: {
		Authorization: `Token ${token}`,
	},
});

axiosRequest.interceptors.request.use(
	(config) => {
		if (!token) {
			token = cookies.get("token");
			config.headers!.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosRequest.interceptors.response.use(
	(config) => {
		useAuthStore.setState({ isAuthenticated: true });
		return config;
	},
	(error) => {
		if (error.response.status === 401) {
			useAuthStore.setState({ isAuthenticated: false });
			cookies.set("logged_in", false, { path: "/", sameSite: "lax" });
			cookies.remove("token", { path: "/", sameSite: "lax" });
		}
		return Promise.reject(error);
	}
);
