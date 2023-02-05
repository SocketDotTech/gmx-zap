import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { useAppSelector } from "../../hooks";
import { getQuote } from "../../services";
import { ChainsSelect } from "../ChainSelect";
import { TokensDetail } from "../TokenDetail";

const GlpBuyWidget = () => {
	const { address } = useAccount();
	const { inputToken, inputTokenAmount, outputToken } = useAppSelector(
		(state) => state.tokens
	);
	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);
	const [route, setRoute] = useState<any>({});

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

	return (
		<>
			{/* GLP Bridge Widget */}
			<div className="max-w-[30rem] w-full bg-[#17192E] rounded border border-[#23263b] max-[900px]:min-w-full p-3">
				<div className="pb-3">
					<ChainsSelect />
				</div>
				<div>
					<TokensDetail />
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
				<button className="p-3 text-white text-base font-semibold w-full rounded bg-[#2E3FD9]">
					Proceed
				</button>
			</div>
		</>
	);
};

export default GlpBuyWidget;
