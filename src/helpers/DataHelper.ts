import { BigNumber } from "ethers";
import {
	glpSupportedTokens,
	SUPPORTED_USDC_TOKENS,
	supportedInputChains,
	supportedOutputChains,
	USD_DECIMALS,
	ZERO_BIG_NUMBER,
} from "../config";
import {
	ChainDetail,
	ChainsDetailObj,
	Obj,
	responseObj,
	TokenDetail,
} from "../types";
import { bigNumberify, expandDecimals } from "./numbers";

export const getChainDataByChainId = (
	chains: any
): {
	chainsByChainId: ChainsDetailObj;
	fromChainsList: Array<ChainDetail>;
	toChainsList: Array<ChainDetail>;
} => {
	const data = chains?.data?.result;
	const chainsByChainId: any = {};
	const fromChainsList: Array<ChainDetail> = [];
	const toChainsList: Array<ChainDetail> = [];

	data.forEach((chain: any) => {
		chainsByChainId[chain.chainId] = chain;
		if (
			chain.sendingEnabled &&
			supportedInputChains.includes(chain.chainId)
		) {
			fromChainsList.push({
				chainId: chain.chainId,
				name: chain.name,
				icon: chain.icon,
				explorers: chain.explorers,
				currency: chain.currency,
			});
		}
		if (
			chain.receivingEnabled &&
			supportedOutputChains.includes(chain.chainId)
		) {
			toChainsList.push({
				chainId: chain.chainId,
				name: chain.name,
				icon: chain.icon,
				explorers: chain.explorers,
				currency: chain.currency,
			});
		}
	});
	return { chainsByChainId, fromChainsList, toChainsList };
};

export const getFromTokensListFromResponse = (
	tokensList: responseObj
): {
	fromTokensList: TokenDetail[];
	inputTokenInfo: TokenDetail;
} => {
	const data: any = tokensList?.data?.result;
	const tokenList: TokenDetail[] = data;
	let inputToken: TokenDetail = tokenList[0];

	inputToken = tokenList.filter((token) => token.symbol === "USDC")[0];

	return { fromTokensList: tokenList, inputTokenInfo: inputToken };
};

export const getToTokensListFromResponse = (
	tokensList: responseObj,
	outputChainId: number
): {
	toTokensList: TokenDetail[];
	outputTokenInfo: TokenDetail;
} => {
	const data: any = tokensList?.data?.result;
	const tokenList: TokenDetail[] = data.filter((token: any) =>
		glpSupportedTokens[outputChainId].includes(token.symbol)
	);
	let outputToken: TokenDetail = tokenList[0];
	outputToken = tokenList.filter((token) => token.address.toLowerCase() === SUPPORTED_USDC_TOKENS[outputChainId].toLowerCase())[0];

	return { toTokensList: tokenList, outputTokenInfo: outputToken };
};

export const getUserBalanceOfChainId = (
	balances: any,
	chainId: number
): any => {
	if (!balances) return {};

	const data = balances?.data?.result;
	const balanceByChainId: Obj = {};
	data.map((balance: any) => {
		if (balance.chainId == chainId) {
			balanceByChainId[balance.address] = balance.amount;
		}
	});
	return balanceByChainId;
};

export const getTokenPriceFromResponse = (
	tokenPrice: responseObj
): {
	tokenPriceBN: BigNumber;
} => {
	const data: any = tokenPrice?.data?.result.tokenPrice.toString();
	const integerPrice = data.split(".")[0];
	if (!integerPrice) return { tokenPriceBN: ZERO_BIG_NUMBER! };
	const tokenPriceBN: BigNumber = bigNumberify(integerPrice)!.mul(
		expandDecimals(1, USD_DECIMALS)
	);

	return { tokenPriceBN };
};
