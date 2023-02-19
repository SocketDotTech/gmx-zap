import React, { useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setEnabledRefuel, setRefuelReset } from "../../redux";

export const RefuelBox = () => {
	const dispatch = useAppDispatch();
	const { enabledRefuel } = useAppSelector((state) => state.refuel);
	const { inputChainId, outputChainId, chainsInfo } = useAppSelector(
		(state) => state.chains
	);

	useEffect(() => {
		dispatch(setRefuelReset());
	}, [inputChainId, outputChainId]);

	return (
		<div className="flex border-2 border-[#23263b] bg-[#212641] px-3 py-4 justify-between items-center rounded">
			<div className="flex items-start gap-2">
				<img
					src="assets/gas-station.png"
					alt="gas station icon"
					width="28"
					height="28"
				/>
				<div>
					<div className="text-sm font-medium flex items-center text-zinc-400 mb-0.5">
						Enable Refuel{" "}
						<img
							id="refuel-info"
							src="assets/info.svg"
							className="ml-1.5 w-3 h-3 cursor-pointer self-center"
						/>
						<ReactTooltip
							anchorId="refuel-info"
							place="top"
							style={{ width: "200px" }}
							content="With Refuel, you can swap native tokens on the source chain for native tokens to transact on the destination chain."
						/>
					</div>
					<div className="text-xs mt-0.5 text-zinc-400">
						{outputChainId !== 0 &&
							Object.keys(chainsInfo).length != 0 && (
								<span>
									Get Gas for transactions on{" "}
									{chainsInfo[outputChainId]?.name}
								</span>
							)}
					</div>
				</div>
			</div>
			<label
				htmlFor="refuel-checkbox"
				className={`w-11 h-7 rounded-full relative ${
					enabledRefuel ? "bg-green-600" : "bg-gray-400"
				} cursor-pointer scale-75`}
			>
				<div
					className={`bg-white h-5 w-5 top-1 absolute rounded-full transition ease-linear duration-200 ${
						enabledRefuel ? "translate-x-5" : "translate-x-1"
					}`}
					onClick={() => dispatch(setEnabledRefuel(!enabledRefuel))}
				></div>
				<input
					type="checkbox"
					className="w-px h-px opacity-0 pointer-events-none"
					id="refuel-checkbox"
					disabled={enabledRefuel}
				/>
			</label>
		</div>
	);
};
