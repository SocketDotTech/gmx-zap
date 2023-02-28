import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
	_Arbitrum,
	_Avalanche,
	_BSC,
	_Ethereum,
	_Fantom,
	_Optimism,
	_Polygon,
} from "./chains";
import { customTheme } from "./theme";

const { chains, provider } = configureChains(
	[
		_Ethereum,
		_Polygon,
		_Optimism,
		_Arbitrum,
		_BSC,
		_Avalanche,
		_Fantom as any,
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

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider coolMode chains={chains} theme={customTheme}>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};
