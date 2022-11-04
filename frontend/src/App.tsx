import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouteComponentProps, Router } from "@reach/router";
import { Home, Error } from "./pages";

const queryClient = new QueryClient();

const HomePage = (props: RouteComponentProps) => <Home />;
const ErrorPage = (props: RouteComponentProps) => <Error />;

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<HomePage path="/" />
				<ErrorPage default={true} />
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
