import React, { ReactNode } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
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
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";

const { chains, publicClient } = configureChains(
  [_Ethereum, _Polygon, _Optimism, _Arbitrum, _BSC, _Avalanche, _Fantom as any],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "GMX x Socket",
  projectId: `${process.env.REACT_APP_WC_PROJECT_ID}`,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider coolMode chains={chains} theme={customTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
