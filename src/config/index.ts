export const supportedInputChains = [
	1, 10, 56, 100, 137, 250, 42161, 43114, 1313161554,
];

export const supportedOutputChains = [42161, 43114];

export const glpSupportedTokens: {
	[x: number]: string[];
} = {
	42161: ["ETH", "WBTC", "LINK", "UNI", "USDC", "USDT", "DAI", "FRAX"],
	43114: ["WETH.E", "AVAX", "WBTC.E", "BTC.B", "USDC", "USDC.E"],
};
