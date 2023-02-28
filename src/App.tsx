import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Header } from "./components";
import { Home } from "./pages";
import { WalletProvider } from "./components/Rainbowkit";

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<WalletProvider>
				<Header />
				<Home />
			</WalletProvider>
		</QueryClientProvider>
	);
};

export default App;
