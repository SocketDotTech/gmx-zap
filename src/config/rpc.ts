import { ARBITRUM, AVALANCHE } from "./chains";

export const RPC_PROVIDERS: {
	[x: number]: string;
} = {
	[ARBITRUM]: process.env.REACT_APP_ARBITRUM_RPC_URL!,
	[AVALANCHE]: process.env.REACT_APP_AVALANCHE_RPC_URL!,
};

export const getRpcUrl = (chainId: number): string | undefined => {
	return RPC_PROVIDERS[chainId];
};
