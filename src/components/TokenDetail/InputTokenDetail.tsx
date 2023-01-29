import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setInputToken } from "../../redux";
import { InputTokenSelectDropdown } from "../Dropdown";

export const InputTokenDetail = () => {
	const dispatch = useAppDispatch();

	const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
	const [inputTokenAmount, setInputTokenAmount] = useState("");
	const { inputToken, fromTokensList } = useAppSelector(
		(state) => state.tokens
	);
	const { inputChainId } = useAppSelector((state) => state.chains);

	const amount = 156,
		balance = 0.0;
	return (
		<div
			id="input-token-select"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			<div className="flex space-between pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Pay: ${amount}
				</div>
				<div className="text-base text-zinc-400 font-medium text-right">
					Balance: <span className="text-white">{balance}</span>
				</div>
			</div>
			<div className="flex space-between">
				<div className="grow text-white mr-2">
					<input
						placeholder="0"
						className="text-xl font-medium bg-transparent w-full text-left border-none outline-none"
						onChange={(e) => {
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
