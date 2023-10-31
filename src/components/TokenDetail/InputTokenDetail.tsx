import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { isValidInput } from "../../helpers";
import { getUserBalanceOfChainId } from "../../helpers/DataHelper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
	setInputChainNativeTokenPrice,
	setInputToken,
	setInputTokenAmount,
	setInputTokenBalance,
	setInputTokenPrice,
} from "../../redux";
import {
	getTokenPriceByTokenAddress,
	getUserTokenBalances,
} from "../../services";
import { InputTokenSelectDropdown } from "../Dropdown";
import { useDebouncedCallback } from "use-debounce";
import {
	INPUT_TOKEN_AMOUNT_FIELD_DEBOUNCE_TIMEOUT,
	NATIVE_TOKEN_ADDRESS,
} from "../../config";

export const InputTokenDetail = () => {
	const dispatch = useAppDispatch();
	const { address } = useAccount();
	const {
		inputToken,
		fromTokensList,
		inputTokenBalance,
		inputTokenAmount,
		inputTokenPrice,
	} = useAppSelector((state) => state.tokens);
	const { inputChainId } = useAppSelector((state) => state.chains);

	const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
	const [inputTokenAmountField, setInputTokenAmountField] =
		useState(inputTokenAmount);

	// debounce set inputTokenAmount in redux
	const debouncedDispatchTokenAmount = useDebouncedCallback(
		(value: string) => {
			dispatch(setInputTokenAmount(value));
		},
		INPUT_TOKEN_AMOUNT_FIELD_DEBOUNCE_TIMEOUT
	);

	useQuery(
		["inputTokenPrice", inputToken],
		() =>
			getTokenPriceByTokenAddress({
				chainId: inputChainId.toString(),
				tokenAddress: inputToken.address,
			}),
		{
			onSuccess: (data: any) => {
				const price: number = data?.data?.result.tokenPrice;
				dispatch(setInputTokenPrice(price));
			},
			enabled: !!(inputToken.chainId !== 0),
			refetchOnWindowFocus: false,
			refetchInterval: 40000,
			refetchIntervalInBackground: true,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retryDelay: 40000,
			notifyOnChangeProps: ["data"],
			retry: 1,
			
		}
	);

	useQuery(
		["inputChainNativeTokenPrice", inputToken],
		() =>
			getTokenPriceByTokenAddress({
				chainId: inputChainId.toString(),
				tokenAddress: NATIVE_TOKEN_ADDRESS,
			}),
		{
			onSuccess: (data: any) => {
				const price: number = data?.data?.result.tokenPrice;
				dispatch(setInputChainNativeTokenPrice(price));
			},
			enabled: !!(inputToken.chainId !== 0),
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchInterval: 40000,
			refetchIntervalInBackground: true,
			retryDelay: 40000,
			retry: 1,
			notifyOnChangeProps: ["data"],
		}
	);

	useQuery(
		["userTokenBalance", inputToken],
		() =>
			getUserTokenBalances({
				userAddress: address!,
			}),
		{
			onSuccess: (data: any) => {
				const tokenBalance = getUserBalanceOfChainId(
					data,
					inputChainId
				);
				if (!tokenBalance[inputToken.address])
					dispatch(setInputTokenBalance(0));
				dispatch(
					setInputTokenBalance(tokenBalance?.[inputToken.address] ?? 0)
				);
			},
			enabled: !!address,
			notifyOnChangeProps: ["data"],
			refetchInterval: 5000,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		
		}
	);

	return (
		<div
			id="input-token-select"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			<div className="flex space-between pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Pay: $
					{inputTokenAmountField === ""
						? "0"
						: (
								parseFloat(inputTokenAmountField) *
								inputTokenPrice
						  ).toLocaleString()}
				</div>
				<div className="text-base text-zinc-400 font-medium text-right">
					Balance:{" "}
					<span className="text-white">
						{inputTokenBalance
							? inputTokenBalance.toFixed(4)
							: "0.00"}
					</span>
				</div>
			</div>
			<div className="flex space-between">
				<div className="grow text-white mr-2">
					<input
						placeholder="0"
						className="text-xl font-medium bg-transparent w-full text-left border-none outline-none mr-2"
						onChange={(e) => {
							if (isValidInput(e.target.value)) {
								setInputTokenAmountField(e.target.value);
								debouncedDispatchTokenAmount(e.target.value);
							}
						}}
						value={inputTokenAmountField}
					/>
				</div>
				<div
					onClick={() => {
						setInputTokenAmountField(inputTokenBalance?.toString());
						debouncedDispatchTokenAmount(
							inputTokenBalance?.toString()
						);
					}}
					className="font-medium mr-2 h-fit text-xs p-1 rounded text-white bg-[#2F4F4F] hover:bg-opacity-80 shadow-inner cursor-pointer"
				>
					MAX
				</div>
				<div
					className="text-xl font-medium text-right flex hover:cursor-pointer"
					onClick={() =>
						setHideInputTokenDropdown(!hideInputTokenDropdown)
					}
				>
					{inputToken.address === "" && (
						<>
							{/* <img src={chainsByChainId[inputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
							<div className="mr-2">
								<img
									src="assets/loading.svg"
									className="inline animate-spin mr-2 h-5 w-5 text-white"
								/>{" "}
								...
							</div>
							<div className="self-center">
								<img
									src="assets/down-arrow.svg"
									className="rotate-90 h-4 w-4"
								/>
							</div>
						</>
					)}
					{inputToken.address != "" && (
						<>
							<img
								src={inputToken.icon}
								className="w-4 h-4 rounded-full mr-1 self-center"
							/>
							<div className="mr-2">{inputToken.symbol}</div>
							<div className="self-center">
								<img
									src="assets/down-arrow.svg"
									className="rotate-90 h-4 w-4"
								/>
							</div>
						</>
					)}
				</div>
				{!hideInputTokenDropdown && inputToken && fromTokensList && (
					<InputTokenSelectDropdown
						options={fromTokensList}
						chainId={inputChainId}
						setTokenDetail={(inputTokenDetail) =>
							dispatch(setInputToken(inputTokenDetail))
						}
						onHide={(val) => setHideInputTokenDropdown(val)}
					/>
				)}
			</div>
		</div>
	);
};
