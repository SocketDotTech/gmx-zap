import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import {
	BASIS_POINTS_DIVISOR,
	DEFAULT_SLIPPAGE_AMOUNT,
	USD_DECIMALS,
} from "../../config";
import { expandDecimals, formatAmount } from "../../helpers";
import { useAppSelector } from "../../hooks";
import { getQuote } from "../../services";
import { ChainsSelect } from "../ChainSelect";
import { TokensDetail } from "../TokenDetail";

const GlpBuyWidget = () => {
	const { address } = useAccount();
	const { inputToken, inputTokenAmount, outputToken } = useAppSelector(
		(state) => state.tokens
	);
	const { glpPrice } = useAppSelector((state) => state.glp);
	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);
	const [route, setRoute] = useState<any>({});
	const [proceedBtnDisabled, setProceedBtnDisabled] = useState<boolean>(true);
	const [proceedBtnText, setProceedBtnTest] = useState<string>("Proceed");
	const [minGlpReceived, setMinGlpReceived] = useState<string>("");

	const quoteListResponse: any = useQuery(
		[
			"quoteList",
			inputToken.address,
			outputToken.address,
			inputTokenAmount,
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
			refetchOnWindowFocus: false,
		}
	);

	const balance = "100";

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
			(parseFloat(inputTokenAmount) || 0) > (parseFloat(balance) || 0)
		) {
			setProceedBtnTest("Not Enough Balance");
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
		balance,
		quoteListResponse.isSuccess,
		route,
	]);

	useEffect(() => {
		if (!quoteListResponse.isSuccess) return;
		if (inputTokenAmount === "") {
			setRoute({});
			return;
		}

		const result: any = quoteListResponse?.data?.data.result;
		let route = {};
		if (result?.routes.length > 0) {
			route = result?.routes[0];
		}
		setRoute(route);
	}, [quoteListResponse.isSuccess, inputTokenAmount]);

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
			minGlpAmount = BigNumber.from(
				(parseFloat(minGlpAmount) * 1000).toFixed(0)
			)
				.mul(BASIS_POINTS_DIVISOR - DEFAULT_SLIPPAGE_AMOUNT)
				.div(BASIS_POINTS_DIVISOR)
				.toString();
			// console.log(expandDecimals(minGlpAmount, 15));
			minGlpAmount = (parseInt(minGlpAmount) / 1000).toString();

			setMinGlpReceived(minGlpAmount);
		}
	}, [route]);

	return (
		<>
			{/* GLP Bridge Widget */}
			<div className="max-w-[30rem] w-full bg-[#17192E] rounded border border-[#23263b] max-[900px]:min-w-full p-3">
				<div className="pb-3">
					<ChainsSelect />
				</div>
				<div>
					<TokensDetail glpReceived={minGlpReceived} />
				</div>
				<div className="pb-3"></div>
				{quoteListResponse.isLoading && (
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
										$
										{route.totalGasFeesInUsd
											.toFixed(2)
											.toString()}
									</div>
								</div>
								<div className="flex justify-between">
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
								</div>
							</div>
							<div className="pb-3"></div>
						</>
					)}
				<div className="flex justify-between">
					<div className="grow text-sm text-zinc-400 font-medium mr-2">
						Fees
					</div>
					<div className="text-sm text-white font-medium text-right">
						0.02%
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
				>
					{proceedBtnText}
				</button>
			</div>
		</>
	);
};

export default GlpBuyWidget;
