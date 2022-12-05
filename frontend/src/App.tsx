import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Route, Switch } from "wouter";
import { Home, Error, Friends, NewExpense, Expenses } from "./pages";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Switch>
				<Route path="/" component={Home} />
				<Route path="/friends" component={Friends} />
				<Route path="/new" component={NewExpense} />
				<Route path="/expenses" component={Expenses} />
				<Route component={Error} />
			</Switch>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
