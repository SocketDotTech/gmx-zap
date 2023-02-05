import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setOutputToken } from "../../redux";
import { OutputTokenSelectDropdown } from "../Dropdown";

export const OutputTokenDetail = () => {
	const dispatch = useAppDispatch();

	const [hideOutputTokenDropdown, setHideOutputTokenDropdown] =
		useState(true);
	const { outputToken, toTokensList } = useAppSelector(
		(state) => state.tokens
	);
	const { outputChainId } = useAppSelector((state) => state.chains);

	return (
		<div
			id="input-token-select"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			{/* <div className="flex pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Destination Token
				</div>
			</div> */}
			<div className="flex space-between">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Destination Token
				</div>
				<div
					className="text-xl font-medium text-right flex hover:cursor-pointer"
					onClick={() =>
						setHideOutputTokenDropdown(!hideOutputTokenDropdown)
					}
				>
					{outputToken.address === "" && (
						<>
							{/* <img src={chainsByChainId[outputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
							<div className="mr-2">
								<img
									src="assets/loading.svg"
									className="inline animate-spin mr-2 h-5 w-5 text-white"
								/>{" "}
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
					{outputToken.address != "" && (
						<>
							<img
								src={outputToken.icon}
								className="w-4 h-4 rounded-full mr-1 self-center"
							/>
							<div className="mr-2">{outputToken.symbol}</div>
							<div className="self-center">
								<img
									src="assets/down-arrow.svg"
									className="rotate-90 h-4 w-4"
								/>
							</div>
						</>
					)}
				</div>
				{!hideOutputTokenDropdown && outputToken && toTokensList && (
					<OutputTokenSelectDropdown
						options={toTokensList}
						chainId={outputChainId}
						setTokenDetail={(outputTokenDetail) =>
							dispatch(setOutputToken(outputTokenDetail))
						}
						onHide={(val) => setHideOutputTokenDropdown(val)}
					/>
				)}
			</div>
		</div>
	);
};
