import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { isValidInput } from "../../helpers";
import { getUserBalanceOfChainId } from "../../helpers/DataHelper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setInputToken, setInputTokenBalance } from "../../redux";
import {
	getTokenPriceByTokenAddress,
	getUserTokenBalances,
} from "../../services";
import { queryResponseObj } from "../../types";
import { InputTokenSelectDropdown } from "../Dropdown";

export const InputTokenDetail = () => {
	const dispatch = useAppDispatch();
	const { address } = useAccount();

	const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
	const [inputTokenAmount, setInputTokenAmount] = useState("");
	const [inputTokenPrice, setInputTokenPrice] = useState(0);
	const { inputToken, fromTokensList, inputTokenBalance } = useAppSelector(
		(state) => state.tokens
	);
	const { inputChainId } = useAppSelector((state) => state.chains);

	const inputTokenPriceResponse: queryResponseObj = useQuery(
		["inputTokenPrice", inputToken],
		() =>
			getTokenPriceByTokenAddress({
				chainId: inputChainId.toString(),
				tokenAddress: inputToken.address,
			}),
		{
			enabled: !!(inputToken.chainId !== 0),
			refetchOnWindowFocus: false,
			refetchInterval: 10000,
			refetchIntervalInBackground: true,
		}
	);

	const balanceResponse = useQuery(
		["userTokenBalance"],
		() =>
			getUserTokenBalances({
				userAddress: address!,
			}),
		{
			enabled: !!address,
		}
	);

	useEffect(() => {
		if (
			(!balanceResponse.isSuccess || inputToken.chainId === 0,
			inputChainId === 0)
		)
			return;

		const tokenBalance = getUserBalanceOfChainId(
			balanceResponse,
			inputChainId
		);
		if (!tokenBalance[inputToken.address]) return;
		dispatch(setInputTokenBalance(tokenBalance[inputToken.address]));
	}, [balanceResponse.isSuccess, inputToken]);

	useEffect(() => {
		if (!inputTokenPriceResponse.isSuccess || inputToken.chainId === 0)
			return;

		const price: number =
			inputTokenPriceResponse.data?.data?.result.tokenPrice;
		setInputTokenPrice(price);
	}, [inputTokenPriceResponse.isSuccess, inputToken]);

	return (
		<div
			id="input-token-select"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			<div className="flex space-between pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Pay: $
					{inputTokenAmount === ""
						? "0"
						: (
								parseFloat(inputTokenAmount) * inputTokenPrice
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
						className="text-xl font-medium bg-transparent w-full text-left border-none outline-none"
						onChange={(e) => {
							if (isValidInput(e.target.value))
								setInputTokenAmount(e.target.value);
						}}
						value={inputTokenAmount}
					/>
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
								{/* <LoadingSvg className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-textColorPrimary" />{" "} */}
								Loading...
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
