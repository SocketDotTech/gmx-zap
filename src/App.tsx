import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { DisclaimerModal, Header } from "./components";
import { Home } from "./pages";
import { WalletProvider } from "./components/Rainbowkit";
import { disclaimerProperty } from "./config";

const queryClient = new QueryClient();

const App = () => {
	const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

	useEffect(() => {
		const disclaimerResponse =
			localStorage.getItem(disclaimerProperty) ?? "false";

		if (disclaimerResponse !== "true") {
			setShowDisclaimerModal(true);
		}
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<WalletProvider>
				<Header />
				<Home />
				{showDisclaimerModal && (
					<DisclaimerModal
						setShowDisclaimerModal={setShowDisclaimerModal}
					/>
				)}
			</WalletProvider>
		</QueryClientProvider>
	);
};

export default App;
