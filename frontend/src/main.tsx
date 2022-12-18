import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	type ThemeConfig,
} from "@chakra-ui/react";

import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const theme = extendTheme({
	initialColorMode: "light",
	useSystemColorMode: false,
	fonts: {
		body: `'Inter', sans-serif`,
	},
	components: {
		Button: {
			baseStyle: {
				_focus: {
					outline: "none",
				},
			},
		},
	},
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<CookiesProvider>
				<QueryClientProvider client={queryClient}>
					<ColorModeScript
						initialColorMode={theme.initialColorMode}
					/>
					<App />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</CookiesProvider>
		</ChakraProvider>
	</React.StrictMode>
);
