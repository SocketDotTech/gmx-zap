import { BigNumber, ethers } from "ethers";
import glpManagerAbi from "./abis/GlpManager.json";
import glpTokenAbi from "./abis/GlpToken.json";
import feeGlpTrackerAbi from "./abis/FeeGlpTracker.json";
import readerAbi from "./abis/Reader.json";
import rewardReaderAbi from "./abis/RewardReader.json";
import rewardRouterAbi from "./abis/RewardRouter.json";
import socketGlpWrapperAbi from "./abis/SocketGlpWrapper.json";
import { NativeTokenDetail } from "../types";
import {
	ARBITRUM,
	AVALANCHE,
	BSC,
	ETHEREUM,
	FANTOM,
	OPTIMISM,
	POLYGON,
} from "./chains";

export const supportedInputChains = [
	ETHEREUM,
	POLYGON,
	BSC,
	ARBITRUM,
	AVALANCHE,
	OPTIMISM,
	FANTOM,
];

export const supportedOutputChains = [ARBITRUM, AVALANCHE];

export const glpSupportedTokens: {
	[x: number]: string[];
} = {
	42161: ["WBTC", "LINK", "UNI", "USDC", "USDT", "DAI", "FRAX", "WETH"],
	43114: ["WETH.E", "WBTC.E", "BTC.B", "USDC", "USDC.E", "WAVAX"],
};

export const GLP_DECIMALS = 18;
export const USD_DECIMALS = 30;

export const BASIS_POINTS_DIVISOR = 10000;
export const DEFAULT_SLIPPAGE_AMOUNT = 30;
export const SECONDS_PER_YEAR = 31536000;

export const ZERO_BIG_NUMBER = BigNumber.from(0);

export const PLACEHOLDER_ACCOUNT = ethers.Wallet.createRandom().address;

export const NATIVE_TOKEN: {
	[x: number]: NativeTokenDetail;
} = {
	[ARBITRUM]: {
		name: "ETH (WETH)",
		symbol: "ETH",
		price: ZERO_BIG_NUMBER,
		address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
	},
	[AVALANCHE]: {
		name: "AVAX (WAVAX)",
		symbol: "AVAX",
		price: ZERO_BIG_NUMBER,
		address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
	},
};

export const abis = {
	glpManagerAbi,
	glpTokenAbi,
	feeGlpTrackerAbi,
	readerAbi,
	rewardReaderAbi,
	rewardRouterAbi,
	socketGlpWrapperAbi,
};

export * from "./contracts";
export * from "./rpc";
export * from "./chains";
