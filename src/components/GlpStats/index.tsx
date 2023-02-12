import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import {
	AVALANCHE,
	GLP_DECIMALS,
	NATIVE_TOKEN,
	PLACEHOLDER_ACCOUNT,
	USD_DECIMALS,
	ZERO_BIG_NUMBER,
} from "../../config";
import { expandDecimals, formatAmount } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
	setApr,
	setGlpPrice,
	setStakedBalance,
	setTotalSupply,
	setWalletBalance,
} from "../../redux";
import {
	getGlpBalance,
	getGlpPrice,
	getGlpTrackerApr,
	getGlpSupply,
} from "../../services";

export const GlpStats = () => {
	const dispatch = useAppDispatch();
	const { address } = useAccount();
	const { outputChainId } = useAppSelector((state) => state.chains);
	const { glpPrice, totalSupply, walletBalance, stakedBalance, apr } =
		useAppSelector((state) => state.glp);
	const { nativeToken } = useAppSelector((state) => state.tokens);

	const [glpTotalSupplyUsd, setGlpTotalSupplyUsd] =
		useState<BigNumber>(ZERO_BIG_NUMBER);
	const [glpWalletBalanceUsd, setGlpWalletBalanceUsd] =
		useState<BigNumber>(ZERO_BIG_NUMBER);

	const glpTrackerAprResponse = useQuery(
		["glpTrackerApr", outputChainId, address, glpPrice, nativeToken],
		() =>
			getGlpTrackerApr({
				chainId: outputChainId,
				userAddress: address || PLACEHOLDER_ACCOUNT,
				glpPrice: glpPrice,
				nativeToken: nativeToken,
			}),
		{
			enabled: !!(
				outputChainId &&
				glpPrice !== ZERO_BIG_NUMBER &&
				nativeToken.price !== ZERO_BIG_NUMBER
			),
			refetchOnWindowFocus: false,
			refetchInterval: 10000,
			refetchIntervalInBackground: true,
		}
	);

	const glpPriceResponse = useQuery(
		["glpPrice", outputChainId],
		() =>
			getGlpPrice({
				chainId: outputChainId,
			}),
		{
			enabled: !!outputChainId,
			refetchOnWindowFocus: false,
			refetchInterval: 5000,
			refetchIntervalInBackground: true,
		}
	);

	const glpBalanceResponse = useQuery(
		["glpBalance", outputChainId, address],
		() =>
			getGlpBalance({
				chainId: outputChainId,
				userAddress: address || PLACEHOLDER_ACCOUNT,
			}),
		{
			enabled: !!outputChainId,
			refetchOnWindowFocus: false,
			refetchInterval: 5000,
			refetchIntervalInBackground: true,
		}
	);

	const glpSupplyResponse = useQuery(
		["glpSupply", outputChainId],
		() =>
			getGlpSupply({
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
		if (!glpPriceResponse.isSuccess) return;
		const { glpPrice } = glpPriceResponse.data;

		dispatch(setGlpPrice(glpPrice));
	}, [glpPriceResponse.isSuccess, outputChainId]);

	useEffect(() => {
		if (!glpBalanceResponse.isSuccess || glpPrice === ZERO_BIG_NUMBER)
			return;
		const { glpWalletBalance } = glpBalanceResponse.data;
		const glpWalletBalanceUSD = glpWalletBalance
			.mul(glpPrice)
			.div(expandDecimals(1, GLP_DECIMALS));

		setGlpWalletBalanceUsd(glpWalletBalanceUSD);
		dispatch(setWalletBalance(glpWalletBalance));
		dispatch(setStakedBalance(glpWalletBalance));
	}, [glpBalanceResponse.isSuccess, outputChainId, glpPrice]);

	useEffect(() => {
		if (!glpSupplyResponse.isSuccess || glpPrice === ZERO_BIG_NUMBER)
			return;
		const { totalSupply } = glpSupplyResponse.data;
		const totalSupplyUSD = totalSupply
			.mul(glpPrice)
			.div(expandDecimals(1, GLP_DECIMALS));

		setGlpTotalSupplyUsd(totalSupplyUSD);
		dispatch(setTotalSupply(totalSupply));
	}, [glpSupplyResponse.isSuccess, outputChainId, glpPrice]);

	useEffect(() => {
		if (
			!glpTrackerAprResponse.isSuccess ||
			glpPrice === ZERO_BIG_NUMBER ||
			nativeToken.price === ZERO_BIG_NUMBER
		)
			return;
		const { feeGlpTrackerApr } = glpTrackerAprResponse.data;

		dispatch(setApr(feeGlpTrackerApr));
	}, [glpTrackerAprResponse.isSuccess, outputChainId, glpPrice, nativeToken]);

	return (
		<>
			{/* GLP Stats */}
			<div className="max-w-[44.5rem] bg-[#17192E] w-full mr-4 rounded divide-y divide-[#23263b] border border-[#23263b] max-[900px]:min-w-full max-[900px]:mb-7">
				<div className="flex p-4">
					<img
						src={`assets/${
							outputChainId == AVALANCHE
								? "ic_glp_avax.svg"
								: "ic_glp_arbitrum.svg"
						}`}
						alt="IC Glp Logo"
						className="w-10 h-10"
					/>
					<div className="pl-1">
						<div className="text-base text-white font-semibold leading-5">
							GLP
						</div>
						<div className="text-xs text-zinc-500 font-medium">
							{outputChainId == AVALANCHE ? "AVAX" : "ARBI"}
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Price
						</div>
						<div className="text-base text-white text-right font-medium">
							${formatAmount(glpPrice, USD_DECIMALS, 3, true)}
						</div>
					</div>
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Wallet
						</div>
						<div className="text-base text-white text-right font-medium">
							{formatAmount(walletBalance, GLP_DECIMALS, 4, true)}{" "}
							GLP ($
							{formatAmount(
								glpWalletBalanceUsd,
								USD_DECIMALS,
								2,
								true
							)}
							)
						</div>
					</div>
					<div className="w-full flex justify-between">
						<div className="text-base text-zinc-400 font-medium">
							Staked
						</div>
						<div className="text-base text-white text-right font-medium">
							{formatAmount(stakedBalance, GLP_DECIMALS, 4, true)}{" "}
							GLP ($
							{formatAmount(
								glpWalletBalanceUsd,
								USD_DECIMALS,
								2,
								true
							)}
							)
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							{outputChainId !== 0 &&
								NATIVE_TOKEN[outputChainId]["name"]}{" "}
							APR
						</div>
						<div className="text-base text-white text-right font-medium">
							{formatAmount(apr, 2, 2, false)}%
						</div>
					</div>
					<div className="w-full flex justify-between pb-1">
						<div className="text-base text-zinc-400 font-medium">
							Total Supply
						</div>
						<div className="text-base text-white text-right font-medium">
							{formatAmount(totalSupply, GLP_DECIMALS, 4, true)}{" "}
							($
							{formatAmount(
								glpTotalSupplyUsd,
								USD_DECIMALS,
								2,
								true
							)}
							)
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
