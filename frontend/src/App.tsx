import { Redirect, Route, Switch } from "wouter";
import { ProtectedRoute } from "./components";

import {
	Home,
	Error,
	Friends,
	FriendsDiscover,
	Login,
	Signup,
	Landing,
	Settings,
} from "./pages";
import { useAuthStore } from "./stores";

function App() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return (
		<Switch>
			<Route path="/">
				{isAuthenticated ? <Redirect to="/home" /> : <Landing />}
			</Route>
			<Route path="/login">
				{isAuthenticated ? <Redirect to="/home" /> : <Login />}
			</Route>
			<Route path="/signup">
				{isAuthenticated ? <Redirect to="/home" /> : <Signup />}
			</Route>
			<ProtectedRoute path="/home">
				<Home />
			</ProtectedRoute>
			<ProtectedRoute path="/friends">
				<Friends />
			</ProtectedRoute>
			<ProtectedRoute path="/discover">
				<FriendsDiscover />
			</ProtectedRoute>
			<ProtectedRoute path="/settings">
				<Settings />
			</ProtectedRoute>
			<Route component={Error} />
		</Switch>
	);
}

export default App;
