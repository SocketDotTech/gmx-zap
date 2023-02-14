import { BigNumber, ethers } from "ethers";
import { Interface } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount, useNetwork, useSigner } from "wagmi";
import {
	abis,
	BASIS_POINTS_DIVISOR,
	CONTRACTS,
	GLP_DECIMALS,
	USD_DECIMALS,
	ZERO_BIG_NUMBER,
} from "../../config";
import { expandDecimals, formatAmount } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setRoute } from "../../redux";
import { getQuote } from "../../services";
import { BridgeTokens } from "../BridgeToken";
import { ChainsSelect } from "../ChainSelect";
import { TokensDetail } from "../TokenDetail";
import { UserSettings } from "../UserSettings";
import { Tooltip as ReactTooltip } from "react-tooltip";

let quoteListResponse: any;
const GAS_LIMIT_FOR_BUYING_GLP = "1930000";

export const GlpBuyWidget = () => {
	const { address } = useAccount();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const dispatch = useAppDispatch();
	const {
		inputToken,
		inputTokenAmount,
		outputToken,
		inputTokenBalance,
		inputChainNativeTokenPrice,
	} = useAppSelector((state) => state.tokens);
	const { glpPrice } = useAppSelector((state) => state.glp);
	const { inputChainId, outputChainId, chainsInfo } = useAppSelector(
		(state) => state.chains
	);
	const { route, slippage } = useAppSelector((state) => state.route);

	const [proceedBtnDisabled, setProceedBtnDisabled] = useState<boolean>(true);
	const [proceedBtnText, setProceedBtnTest] = useState<string>("Proceed");
	const [minGlpReceived, setMinGlpReceived] = useState<string>("");
	const [tabIndex, setTabIndex] = useState<number>(0);
	const [minGlpAmount, setMinGlpAmount] =
		useState<BigNumber>(ZERO_BIG_NUMBER);
	const [finalRoute, setFinalRoute] = useState<any>({});
	const [destinationCallData, setDestinationCallData] = useState<any>({});

	quoteListResponse = useQuery(
		[
			"quoteList",
			inputToken.address,
			outputToken.address,
			inputTokenAmount,
			tabIndex,
		],
		() => {
			return getQuote({
				fromChainId: inputChainId.toString(),
				fromTokenAddress: inputToken.address,
				toChainId: outputChainId.toString(),
				toTokenAddress: outputToken.address,
				fromAmount: (
					parseFloat(inputTokenAmount) *
					10 ** inputToken.decimals
				)
					.toLocaleString()
					.split(",")
					.join(""),
				userAddress: address || "",
				uniqueRoutesPerBridge: true,
				sort: "output",
				includeBridges: ["stargate"],
				singleTxOnly: true,
				recipient: CONTRACTS[outputChainId]["SocketGlpWrapper"],
			});
		},
		{
			enabled: !!(
				address &&
				inputToken.address &&
				outputToken.address &&
				inputTokenAmount != ""
			),
			cacheTime: 0,
			refetchInterval: 30000,
			refetchOnWindowFocus: false,
		}
	);

	useEffect(() => {
		if (!address) {
			setProceedBtnTest("Connect Wallet");
			setProceedBtnDisabled(true);
		} else if ((parseFloat(inputTokenAmount) || 0) == 0) {
			setProceedBtnTest("Enter Input Token Amount");
			setProceedBtnDisabled(true);
		} else if (quoteListResponse.isLoading) {
			setProceedBtnTest("Fetching Route...");
			setProceedBtnDisabled(true);
		} else if (
			(parseFloat(inputTokenAmount) || 0) > (inputTokenBalance || 0)
		) {
			setProceedBtnTest("Not Enough Balance");
			setProceedBtnDisabled(true);
		} else if (chain!.id != inputChainId) {
			setProceedBtnTest(`Switch to ${chainsInfo[inputChainId]["name"]}`);
			setProceedBtnDisabled(true);
		} else if (
			quoteListResponse.isSuccess &&
			Object.keys(route).length !== 0
		) {
			setProceedBtnTest("Proceed");
			setProceedBtnDisabled(false);
		} else if (
			quoteListResponse.isSuccess &&
			Object.keys(route).length === 0
		) {
			setProceedBtnTest("No Routes Available");
			setProceedBtnDisabled(true);
		} else {
			setProceedBtnTest("Loading...");
			setProceedBtnDisabled(true);
		}
	}, [
		address,
		inputTokenAmount,
		quoteListResponse.isLoading,
		inputTokenBalance,
		quoteListResponse.isSuccess,
		route,
		chain,
	]);

	useEffect(() => {
		if (!quoteListResponse.isSuccess) return;
		if (inputTokenAmount === "") {
			dispatch(setRoute({}));
			return;
		}

		const result: any = quoteListResponse?.data?.data.result;
		let route = {};
		if (result?.routes.length > 0) {
			route = result?.routes[0];
		}
		dispatch(setRoute(route));
	}, [
		quoteListResponse.isSuccess,
		quoteListResponse.isFetching,
		inputTokenAmount,
	]);

	useEffect(() => {
		if (Object.keys(route).length === 0) {
			if (minGlpReceived !== "") setMinGlpReceived("");
		} else {
			const glpPriceInUSD = formatAmount(
				glpPrice,
				USD_DECIMALS,
				10,
				true
			);
			let minGlpAmount = (
				(route.receivedValueInUsd + route.totalGasFeesInUsd) /
				parseFloat(glpPriceInUSD)
			).toString();
			minGlpAmount = parseFloat(minGlpAmount).toFixed(3);
			setMinGlpReceived(minGlpAmount);
			minGlpAmount = BigNumber.from(
				(parseFloat(minGlpAmount) * 1000).toFixed(0)
			)
				.mul(BASIS_POINTS_DIVISOR - slippage * 100)
				.div(BASIS_POINTS_DIVISOR)
				.toString();

			setMinGlpAmount(expandDecimals(minGlpAmount, 15));

			minGlpAmount = (parseInt(minGlpAmount) / 1000).toString();
		}
	}, [route, slippage]);

	const proceedToFinal = async () => {
		if (!address) return;
		setProceedBtnTest("Loading...");
		setProceedBtnDisabled(true);

		const contract = new ethers.Contract(
			CONTRACTS[outputChainId]["SocketGlpWrapper"],
			abis.rewardRouterAbi,
			signer!
		);
		const method = "buyGlp";
		console.log([address, outputToken.address, 0, minGlpAmount]);
		const params = [address, outputToken.address, 0, minGlpAmount];
		const value = 0;

		const iFace = new Interface(abis.socketGlpWrapperAbi);
		const destinationPayload = iFace.encodeFunctionData(method, params);

		// const gasLimit = await getGasLimit(contract, method, params, value);
		const gasLimit = BigNumber.from(GAS_LIMIT_FOR_BUYING_GLP);
		const destinationGasLimit = gasLimit.toNumber() + 30000;

		console.log(destinationGasLimit);
		console.log({
			fromChainId: inputChainId.toString(),
			fromTokenAddress: inputToken.address,
			toChainId: outputChainId.toString(),
			toTokenAddress: outputToken.address,
			fromAmount: (
				parseFloat(inputTokenAmount) *
				10 ** inputToken.decimals
			)
				.toLocaleString()
				.split(",")
				.join(""),
			userAddress: address || "",
			uniqueRoutesPerBridge: true,
			sort: "output",
			includeBridges: ["stargate"],
			singleTxOnly: true,
			recipient: CONTRACTS[outputChainId]["SocketGlpWrapper"],
			destinationPayload: destinationPayload,
			destinationGasLimit: destinationGasLimit.toString(),
		});

		const finalRoute: any = await getQuote({
			fromChainId: inputChainId.toString(),
			fromTokenAddress: inputToken.address,
			toChainId: outputChainId.toString(),
			toTokenAddress: outputToken.address,
			fromAmount: (
				parseFloat(inputTokenAmount) *
				10 ** inputToken.decimals
			)
				.toLocaleString()
				.split(",")
				.join(""),
			userAddress: address || "",
			uniqueRoutesPerBridge: true,
			sort: "output",
			includeBridges: ["stargate"],
			singleTxOnly: true,
			recipient: CONTRACTS[outputChainId]["SocketGlpWrapper"],
			destinationPayload: destinationPayload,
			destinationGasLimit: destinationGasLimit.toString(),
		});

		let FINAL_ROUTE;
		if (finalRoute.data?.result?.routes.length > 0) {
			FINAL_ROUTE = finalRoute.data?.result?.routes[0];
			const DESTINATION_CALLDATA =
				finalRoute.data?.result?.destinationCallData;
			console.log(FINAL_ROUTE);
			console.log(DESTINATION_CALLDATA);
			setDestinationCallData(DESTINATION_CALLDATA);
			setFinalRoute(FINAL_ROUTE);
			setTabIndex(1);
		} else {
			setProceedBtnTest("No Routes Available");
			setProceedBtnDisabled(true);
		}
	};

	return (
		<>
			{/* GLP Bridge Widget */}
			<div className="max-w-[30rem] w-full bg-[#17192E] rounded border border-[#23263b] max-[900px]:min-w-full p-3">
				{tabIndex === 0 && (
					<>
						<div className="pb-3">
							<UserSettings />
						</div>
						<div className="pb-3">
							<ChainsSelect />
						</div>
						<div>
							<TokensDetail glpReceived={minGlpReceived} />
						</div>
						<div className="pb-3"></div>
						{quoteListResponse.isFetching && (
							<>
								<div className="text-sm font-medium text-white">
									<div className="flex justify-between">
										<div className="grow mr-2">
											Fetching Route...
										</div>
										<img
											src="assets/loading.svg"
											className="inline animate-spin mr-2 h-3 w-3 text-white"
										/>{" "}
									</div>
								</div>
								<div className="pb-1"></div>
							</>
						)}
						{quoteListResponse.isSuccess &&
							Object.keys(route).length !== 0 && (
								<>
									<div className="px-3 py-3.5 bg-[#2F3043] rounded-lg">
										<div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Bridge
											</div>
											<div className="text-sm text-white font-medium text-right">
												{route.usedBridgeNames[0]}
											</div>
										</div>
										<div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Estimated Time
											</div>
											<div className="text-sm text-white font-medium text-right">
												{route.serviceTime / 60} min
											</div>
										</div>
										<div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Source Gas Fee
											</div>
											<div className="text-sm text-white font-medium text-right">
												~{" "}
												{(
													route.totalGasFeesInUsd.toFixed(
														2
													) /
													inputChainNativeTokenPrice
												)
													.toFixed(3)
													.toString()}{" "}
												{
													chainsInfo[inputChainId]
														.currency.symbol
												}{" "}
												($
												{route.totalGasFeesInUsd
													.toFixed(2)
													.toString()}
												)
											</div>
										</div>
										{/* <div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Dest. Token Amount
											</div>
											<div className="text-sm text-white font-medium text-right">
												{(
													parseInt(route.toAmount) /
													10 ** outputToken.decimals
												).toString()}{" "}
												{outputToken.symbol}
											</div>
										</div> */}
										<div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Min GLP Received
											</div>
											<div className="text-sm text-white font-medium text-right">
												{formatAmount(
													minGlpAmount,
													GLP_DECIMALS,
													3,
													true
												)}{" "}
												GLP
											</div>
										</div>
									</div>
									<div className="pb-3"></div>
								</>
							)}
						<div className="flex justify-between">
							<div className="grow text-sm text-zinc-400 font-medium mr-2">
								<div className="flex flex-row">
									Slippage
									<img
										id="slippage-glp-info"
										src="assets/info.svg"
										className="ml-1.5 w-4 h-4 cursor-pointer self-center"
									/>
									<ReactTooltip
										anchorId="slippage-glp-info"
										place="top"
										style={{ width: "200px" }}
										content="Your buying GLP tx will revert and you'll receive USDC if the price changes unfavourably by more than this percentage."
									/>
								</div>
							</div>
							<div className="text-sm text-white font-medium text-right">
								{slippage}%
							</div>
						</div>

						<div className="pb-1"></div>
						<button
							className={`p-3 text-white text-base font-semibold w-full rounded bg-[#2E3FD9] ${
								proceedBtnDisabled
									? "cursor-not-allowed bg-[#5B5C68]"
									: "cursor-pointer"
							}`}
							disabled={proceedBtnDisabled}
							onClick={proceedToFinal}
						>
							{proceedBtnText}
						</button>
					</>
				)}
				{tabIndex === 1 && (
					<>
						<BridgeTokens
							setTabIndex={setTabIndex}
							route={finalRoute}
							glpReceived={minGlpReceived}
							destinationCallData={destinationCallData}
						/>
					</>
				)}
			</div>
		</>
	);
};
