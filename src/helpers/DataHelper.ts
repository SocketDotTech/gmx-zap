import {
	glpSupportedTokens,
	supportedInputChains,
	supportedOutputChains,
} from "../config";
import {
	ChainDetail,
	ChainsDetailObj,
	queryResponseObj,
	TokenDetail,
} from "../types";

export const getChainDataByChainId = (
	chains: any
): {
	chainsByChainId: ChainsDetailObj;
	fromChainsList: Array<ChainDetail>;
	toChainsList: Array<ChainDetail>;
} => {
	const data = chains.data?.data?.result;
	const chainsByChainId: ChainsDetailObj = {};
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
	const inputToken: TokenDetail = tokenList[0];

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
	const outputToken: TokenDetail = tokenList[0];

	return { toTokensList: tokenList, outputTokenInfo: outputToken };
};
