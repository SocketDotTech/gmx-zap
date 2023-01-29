import React, { useState } from "react";
import { ChainSelectDropdown } from "../Dropdown";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setOutputChainId } from "../../redux";

export const OutputChainSelect: React.FC = () => {
	const dispatch = useAppDispatch();

	const [hideInputChainDropdown, setHideInputChainDropdown] = useState(true);
	const { outputChainId, chainsInfo, outputChainsList } = useAppSelector(
		(state) => state.chains
	);

	return (
		<div
			id="input-chain-select"
			className="hover:bg-[#2F3043] col-start-7 col-span-5 text-white bg-[#212641] px-3 py-2 relative rounded border-2 border-[#23263b]"
		>
			<div className="flex flex-col">
				<div className="text-base text-zinc-400 font-medium">
					Buy on
				</div>
				<div
					className="flex flex-row justify-between hover:cursor-pointer"
					onClick={() =>
						setHideInputChainDropdown(!hideInputChainDropdown)
					}
				>
					<div className="text-lg font-semibold">
						{chainsInfo ? (
							<div className="flex flex-row items-center">
								{outputChainId === 0 ? (
									"Loading..."
								) : (
									<>
										<img
											src={chainsInfo[outputChainId].icon}
											className="w-6 h-6 rounded-md mr-2"
										/>
										<div>
											{chainsInfo[outputChainId].name}
										</div>
									</>
								)}
							</div>
						) : (
							<div>
								<img
									src="assets/loading.svg"
									className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-white"
								/>{" "}
								Loading...
							</div>
						)}
					</div>
					<div className="self-center">
						<img
							src="assets/down-arrow.svg"
							className="rotate-90 h-4 w-4"
						/>
					</div>
					{!hideInputChainDropdown && outputChainsList && (
						<ChainSelectDropdown
							options={outputChainsList}
							setChain={(chainId) => {
								if (chainId === outputChainId) return;
								else dispatch(setOutputChainId(chainId));
							}}
							onHide={(val) => setHideInputChainDropdown(val)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
