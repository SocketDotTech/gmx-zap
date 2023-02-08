import { ARBITRUM, AVALANCHE } from "./chains";

export const RPC_PROVIDERS: {
	[x: number]: string;
} = {
	[ARBITRUM]: "https://arb1.arbitrum.io/rpc",
	[AVALANCHE]: "https://api.avax.network/ext/bc/C/rpc",
};

export const getRpcUrl = (chainId: number): string | undefined => {
	return RPC_PROVIDERS[chainId];
};
