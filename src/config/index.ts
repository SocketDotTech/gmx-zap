import { BigNumber, ethers } from "ethers";
import glpManagerAbi from "./abis/GlpManager.json";
import glpTokenAbi from "./abis/GlpToken.json";
import feeGlpTrackerAbi from "./abis/FeeGlpTracker.json";
import readerAbi from "./abis/Reader.json";
import rewardReaderAbi from "./abis/RewardReader.json";
import rewardRouterAbi from "./abis/RewardRouter.json";
import socketGlpWrapperAbi from "./abis/SocketGlpWrapper.json";
import vaultAbi from "./abis/Vault.json";
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
import { ZERO_BIG_NUMBER } from "./constants";

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


export const SUPPORTED_USDC_TOKENS: Record<number,string> = {
	[ARBITRUM]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
	[AVALANCHE]: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
}

export const abis = {
	glpManagerAbi,
	glpTokenAbi,
	feeGlpTrackerAbi,
	readerAbi,
	rewardReaderAbi,
	rewardRouterAbi,
	socketGlpWrapperAbi,
	vaultAbi
};

export * from "./contracts";
export * from "./rpc";
export * from "./chains";
export * from "./constants";
