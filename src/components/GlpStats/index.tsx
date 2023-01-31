import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setGlpPrice } from "../../redux";
import { getGlpStats } from "../../services";

const GlpStats = () => {
	const dispatch = useAppDispatch();
	const { outputChainId } = useAppSelector((state) => state.chains);
	const { glpPrice } = useAppSelector((state) => state.glp);

	const glpStatsResponse = useQuery(
		["glpStats", outputChainId],
		() =>
			getGlpStats({
				chainId: outputChainId,
			}),
		{
			enabled: !!outputChainId,
			refetchOnWindowFocus: false,
			refetchInterval: 5000,
			refetchIntervalInBackground: true,
		}
	);

	useEffect(() => {
		if (!glpStatsResponse.isSuccess) return;
		const glpPrice = glpStatsResponse.data?.glpPrice;
		dispatch(setGlpPrice(glpPrice));
	}, [glpStatsResponse.isSuccess, outputChainId]);

	return (
		<>
			{/* GLP Stats */}
			<div className="max-w-[44.5rem] bg-[#17192E] w-full mr-4 rounded divide-y divide-[#23263b] border border-[#23263b] max-[900px]:min-w-full max-[900px]:mb-7">
				<div className="flex p-4">
					<img
						src={"assets/ic_glp_arbitrum.svg"}
						alt="IC Glp Logo"
						className="w-10 h-10"
					/>
					<div className="pl-1">
						<div className="text-base text-white font-semibold leading-5">
							GLP
						</div>
						<div className="text-xs text-zinc-500 font-medium">
							ARBI
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Price
						</div>
						<div className="text-base text-white text-right font-medium">
							${glpPrice}
						</div>
					</div>
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Wallet
						</div>
						<div className="text-base text-white text-right font-medium">
							0.0000 GLP ($0.00)
						</div>
					</div>
					<div className="w-full flex justify-between">
						<div className="text-base text-zinc-400 font-medium">
							Staked
						</div>
						<div className="text-base text-white text-right font-medium">
							0.0000 GLP ($0.00)
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							APR
						</div>
						<div className="text-base text-white text-right font-medium">
							19.51%
						</div>
					</div>
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Total Supply
						</div>
						<div className="text-base text-white text-right font-medium">
							435,027,592.6820 GLP ($408,982,348.22)
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GlpStats;
