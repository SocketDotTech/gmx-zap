import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  avalanche,
  fantom,
} from "@wagmi/chains";
import { customTheme } from "./theme";

// chains with icon
const bscWithIcon = {
  ...bsc,
  iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/BSC.svg",
};
const fantomWithIcon = {
  ...fantom,
  iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Fantom.svg",
};

const { chains, provider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    bscWithIcon,
    avalanche,
    fantomWithIcon,
  ],
  [publicProvider()]
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
