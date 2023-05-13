import { Redirect, Route, Switch } from "wouter";
import { ProtectedRoute } from "./components";

import {
	Home,
	Error,
	Friends,
	NewExpense,
	Expenses,
	Login,
	Signup,
	Landing,
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
			<ProtectedRoute path="/new">
				<NewExpense />
			</ProtectedRoute>
			<ProtectedRoute path="/expenses">
				<Expenses />
			</ProtectedRoute>
			<ProtectedRoute path="/friends">
				<Friends />
			</ProtectedRoute>
			<Route component={Error} />
		</Switch>
	);
}

export default App;
