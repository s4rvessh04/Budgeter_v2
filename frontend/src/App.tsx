import { Router } from "@reach/router";
import { Navbar } from "./components";
import { Home, Error } from "./pages";

function App() {
	return (
		<Router>
			<Home path="/" />
			<Error default={true} />
		</Router>
	);
}

export default App;
