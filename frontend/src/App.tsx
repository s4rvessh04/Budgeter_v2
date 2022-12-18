import { Route, Switch } from "wouter";
import { ProtectedRoute } from "./components";

import {
	Home,
	Error,
	Friends,
	NewExpense,
	Expenses,
	Login,
	Landing,
} from "./pages";

function App() {
	return (
		<Switch>
			<Route path="/">
				{/* {isAuthenticated ? <Redirect to="/home" /> : <Landing />} */}
				<Landing />
			</Route>
			<Route path="/login">
				{/* {isAuthenticated ? <Redirect to="/home" /> : <Login />} */}
				<Login />
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
