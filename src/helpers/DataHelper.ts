import { BigNumber } from "ethers";
import {
	glpSupportedTokens,
	supportedInputChains,
	supportedOutputChains,
	USD_DECIMALS,
} from "../config";
import {
	ChainDetail,
	ChainsDetailObj,
	Obj,
	queryResponseObj,
	TokenDetail,
} from "../types";
import { expandDecimals } from "./numbers";

export const getChainDataByChainId = (
	chains: any
): {
	chainsByChainId: ChainsDetailObj;
	fromChainsList: Array<ChainDetail>;
	toChainsList: Array<ChainDetail>;
} => {
	const data = chains.data?.data?.result;
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
	tokensList: queryResponseObj
): {
	fromTokensList: TokenDetail[];
	inputTokenInfo: TokenDetail;
} => {
	const data: any = tokensList.data?.data?.result;
	const tokenList: TokenDetail[] = data;
	let inputToken: TokenDetail = tokenList[0];

	inputToken = tokenList.filter((token) => token.symbol == "USDC")[0];

	return { fromTokensList: tokenList, inputTokenInfo: inputToken };
};

export const getToTokensListFromResponse = (
	tokensList: queryResponseObj,
	outputChainId: number
): {
	toTokensList: TokenDetail[];
	outputTokenInfo: TokenDetail;
} => {
	const data: any = tokensList.data?.data?.result;
	const tokenList: TokenDetail[] = data.filter((token: any) =>
		glpSupportedTokens[outputChainId].includes(token.symbol)
	);
	let outputToken: TokenDetail = tokenList[0];

	outputToken = tokenList.filter((token) => token.symbol == "USDC")[0];

	return { toTokensList: tokenList, outputTokenInfo: outputToken };
};

export const getUserBalanceOfChainId = (
	balances: any,
	chainId: number
): any => {
	if (!balances.isSuccess) return {};

	const data = balances.data?.data?.result;
	const balanceByChainId: Obj = {};
	data.map((balance: any) => {
		if (balance.chainId == chainId) {
			balanceByChainId[balance.address] = balance.amount;
		}
	});
	return balanceByChainId;
};

export const getTokenPriceFromResponse = (
	tokenPrice: queryResponseObj
): {
	tokenPriceBN: BigNumber;
} => {
	const data: any = tokenPrice.data?.data?.result.tokenPrice.toString();
	const integerPrice = data.split(".")[0];
	const tokenPriceBN: BigNumber = BigNumber.from(integerPrice).mul(
		expandDecimals(1, USD_DECIMALS)
	);

	return { tokenPriceBN };
};
