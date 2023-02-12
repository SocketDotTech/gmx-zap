import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import merge from "lodash.merge";
import {
	getDefaultWallets,
	RainbowKitProvider,
	midnightTheme,
	Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
	mainnet,
	polygon,
	optimism,
	arbitrum,
	bsc,
	gnosis,
	avalanche,
	fantom,
	aurora,
} from "@wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "react-query";
import { Header } from "./components";
import { Home } from "./pages";

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
	[
		mainnet,
		polygon,
		optimism,
		arbitrum,
		avalanche,
		bsc,
		gnosis,
		fantom,
		aurora as any,
	],
	[
		alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID! }),
		publicProvider(),
	]
);

const { connectors } = getDefaultWallets({
	appName: "GMX x Socket",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const customTheme: Theme = merge(midnightTheme(), {
	colors: {
		accentColor: "#2F3ED9",
		accentColorForeground: "white",
		modalBackground: "#17192E",
		profileForeground: "#17192E",
		connectButtonBackground: "#17192E",
		modalBorder: "#363646",
	},
	radii: {
		connectButton: "8px",
	},
} as Theme);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider
					coolMode
					chains={chains}
					theme={customTheme}
				>
					<Header />
					<Home />
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider>
	);
};

export default App;
