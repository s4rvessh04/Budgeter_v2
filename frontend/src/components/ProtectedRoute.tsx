import { Redirect, Route, RouteProps } from "wouter";
import { useAuthStore } from "../stores";

export const ProtectedRoute = (props: RouteProps) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const renderChild = isAuthenticated ? props.children : <Redirect to="/" />;

	return <Route {...props}>{renderChild}</Route>;
};
