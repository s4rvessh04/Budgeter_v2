import create from "zustand";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

interface AuthState {
	isAuthenticated: boolean;
	updateIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	isAuthenticated:
		cookies.get("loggedin") === "True" ||
		cookies.get("sessionid") !== undefined,
	updateIsAuthenticated: (value: boolean) =>
		set(() => ({ isAuthenticated: value })),
}));
