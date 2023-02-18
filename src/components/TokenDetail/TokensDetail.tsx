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
import { NativeTokenDetail } from "../../types";
import { InputTokenDetail } from "./InputTokenDetail";
import { ReceiveGlpDetail } from "./ReceiveGlpDetail";

export const TokensDetail = ({ glpReceived }: { glpReceived: string }) => {
	const dispatch = useAppDispatch();

	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);
	const { inputToken, outputToken } = useAppSelector((state) => state.tokens);

	useQuery(
		["fromTokenList", inputChainId],
		() =>
			getFromTokenList({
				fromChainId: inputChainId.toString(),
				toChainId: outputChainId.toString(),
				isShortList: true,
			}),
		{
			onSuccess: (data: any) => {
				const { fromTokensList, inputTokenInfo } =
					getFromTokensListFromResponse(data);

				dispatch(setFromTokensList(fromTokensList));
				if (inputToken.chainId !== inputTokenInfo.chainId)
					dispatch(setInputToken(inputTokenInfo));
			},
			enabled: !!inputChainId,
			refetchOnWindowFocus: true,
		}
	);

	useQuery(
		["toTokenList", outputChainId],
		() =>
			getToTokenList({
				fromChainId: inputChainId.toString(),
				toChainId: outputChainId.toString(),
				isShortList: true,
			}),
		{
			onSuccess: (data: any) => {
				const { toTokensList, outputTokenInfo } =
					getToTokensListFromResponse(data, outputChainId);

				dispatch(setToTokensList(toTokensList));
				if (outputToken.chainId !== outputTokenInfo.chainId)
					dispatch(setOutputToken(outputTokenInfo));
			},
			enabled: !!outputChainId,
			refetchOnWindowFocus: true,
		}
	);

	useQuery(
		["nativeTokenPrice", outputChainId],
		() =>
			getTokenPriceByTokenAddress({
				chainId: outputChainId.toString(),
				tokenAddress: NATIVE_TOKEN[outputChainId]["address"],
			}),
		{
			onSuccess: (data: any) => {
				const { tokenPriceBN } = getTokenPriceFromResponse(data);
				const nativeTokenDetail: NativeTokenDetail = {
					name: NATIVE_TOKEN[outputChainId]["name"],
					price: tokenPriceBN,
					symbol: NATIVE_TOKEN[outputChainId]["symbol"],
					address: NATIVE_TOKEN[outputChainId]["address"],
				};

				dispatch(setNativeToken(nativeTokenDetail));
			},
			enabled: !!outputChainId,
			refetchOnWindowFocus: true,
			refetchInterval: 5000,
			refetchIntervalInBackground: false,
		}
	);

	return (
		<div>
			<InputTokenDetail />
			<div className="pb-3"></div>
			{/* <OutputTokenDetail />
			<div className="pb-3"></div> */}
			<ReceiveGlpDetail glpReceived={glpReceived} />
		</div>
	);
};
