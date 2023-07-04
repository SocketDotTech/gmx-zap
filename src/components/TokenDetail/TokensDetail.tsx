import React from "react";
import { useQuery } from "react-query";
import { NATIVE_TOKEN, NATIVE_TOKEN_SYMBOLS } from "../../config";
import {
	bigNumberify,
	formatAmount,
	getFromTokensListFromResponse,
	getTokenPriceFromResponse,
	getToTokensListFromResponse,
} from "../../helpers";
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
	const { enabledRefuel, fromAmount, toAmount } = useAppSelector(
		(state) => state.refuel
	);

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
			{enabledRefuel && fromAmount != "" && inputChainId != 0 && (
				<p className="text-pink-600 text-sm font-semibold">
					+{formatAmount(bigNumberify(fromAmount), 18, 3)}{" "}
					{NATIVE_TOKEN_SYMBOLS[inputChainId]} for Refuel
				</p>
			)}
			<div className="pb-3"></div>
			<ReceiveGlpDetail glpReceived={glpReceived} />
			{enabledRefuel && toAmount != "" && outputChainId != 0 && (
				<p className="text-pink-600 text-sm font-semibold">
					+{formatAmount(bigNumberify(toAmount), 18, 3)}{" "}
					{NATIVE_TOKEN_SYMBOLS[outputChainId]} for Refuel
				</p>
			)}
		</div>
	);
};
