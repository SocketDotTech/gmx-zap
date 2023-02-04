import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { NATIVE_TOKEN } from "../../config";
import {
	getFromTokensListFromResponse,
	getTokenPriceFromResponse,
	getToTokensListFromResponse,
} from "../../helpers/DataHelper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
	setFromTokensList,
	setInputToken,
	setNativeToken,
	setOutputToken,
	setToTokensList,
} from "../../redux";
import {
	getFromTokenList,
	getTokenPriceByTokenAddress,
	getToTokenList,
} from "../../services";
import { NativeTokenDetail, queryResponseObj } from "../../types";
import { InputTokenDetail } from "./InputTokenDetail";
import { OutputTokenDetail } from "./OutputTokenDetail";
import { ReceiveGlpDetail } from "./ReceiveGlpDetail";

export const TokensDetail = () => {
	const dispatch = useAppDispatch();

	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);
	const { inputToken, outputToken } = useAppSelector((state) => state.tokens);
	const fromTokenListResponse: queryResponseObj = useQuery(
		["fromTokenList", inputChainId],
		() =>
			getFromTokenList({
				fromChainId: inputChainId.toString(),
				toChainId: outputChainId.toString(),
				isShortList: true,
			}),
		{
			enabled: !!inputChainId,
			refetchOnWindowFocus: false,
		}
	);

	const toTokenListResponse: queryResponseObj = useQuery(
		["toTokenList", outputChainId],
		() =>
			getToTokenList({
				fromChainId: inputChainId.toString(),
				toChainId: outputChainId.toString(),
				isShortList: true,
			}),
		{
			enabled: !!outputChainId,
			refetchOnWindowFocus: false,
		}
	);

	const nativeTokenPriceResponse: queryResponseObj = useQuery(
		["nativeTokenPrice", outputChainId],
		() =>
			getTokenPriceByTokenAddress({
				chainId: outputChainId.toString(),
				tokenAddress: NATIVE_TOKEN[outputChainId]["address"],
			}),
		{
			enabled: !!outputChainId,
			refetchOnWindowFocus: false,
			refetchInterval: 10000,
			refetchIntervalInBackground: true,
		}
	);

	useEffect(() => {
		if (!nativeTokenPriceResponse.isSuccess || outputChainId === 0) return;

		const { tokenPriceBN } = getTokenPriceFromResponse(
			nativeTokenPriceResponse
		);
		const nativeTokenDetail: NativeTokenDetail = {
			name: NATIVE_TOKEN[outputChainId]["name"],
			price: tokenPriceBN,
			address: NATIVE_TOKEN[outputChainId]["address"],
		};

		dispatch(setNativeToken(nativeTokenDetail));
	}, [nativeTokenPriceResponse.isSuccess, outputChainId]);

	useEffect(() => {
		if (
			Object.keys(fromTokenListResponse).length === 0 ||
			!fromTokenListResponse.isSuccess ||
			inputChainId === 0
		)
			return;

		const { fromTokensList, inputTokenInfo } =
			getFromTokensListFromResponse(fromTokenListResponse);

		dispatch(setFromTokensList(fromTokensList));
		if (inputToken.chainId !== inputTokenInfo.chainId)
			dispatch(setInputToken(inputTokenInfo));
	}, [fromTokenListResponse.isSuccess, inputChainId]);

	useEffect(() => {
		if (
			Object.keys(toTokenListResponse).length === 0 ||
			!toTokenListResponse.isSuccess ||
			outputChainId === 0
		)
			return;

		const { toTokensList, outputTokenInfo } = getToTokensListFromResponse(
			toTokenListResponse,
			outputChainId
		);

		dispatch(setToTokensList(toTokensList));
		if (outputToken.chainId !== outputTokenInfo.chainId)
			dispatch(setOutputToken(outputTokenInfo));
	}, [toTokenListResponse.isSuccess, outputChainId]);

	return (
		<div>
			<InputTokenDetail />
			<div className="pb-3"></div>
			<OutputTokenDetail />
			<div className="pb-3"></div>
			<ReceiveGlpDetail />
		</div>
	);
};
