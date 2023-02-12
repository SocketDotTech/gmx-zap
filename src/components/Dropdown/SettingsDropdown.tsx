import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useClickAway } from "../../hooks";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { setSlippage } from "../../redux";
import { isValidSlippage } from "../../helpers";

type Props = {
	onHide: (value: boolean) => void;
};

const defaultSlippageArray = [0.5, 1, 3];

export const SettingsDropdown = ({ onHide }: Props) => {
	const dispatch = useAppDispatch();
	const clickAwayRef = useRef<HTMLDivElement>(null);

	const { slippage } = useAppSelector((state) => state.route);
	const [customSlippage, setCustomSlippage] = useState(
		defaultSlippageArray.includes(slippage) ? "" : slippage
	);

	useClickAway(clickAwayRef, () => onHide(true));

	return (
		<div
			ref={clickAwayRef}
			className="absolute text-white bg-[#141529] top-5 right-2 p-4 rounded z-10 border border-[#23263b]"
			style={{ width: "350px" }}
		>
			<div className="text-lg font-medium text-white text-center">
				Settings
			</div>
			<div className="pt-7 pb-4 flex flex-col">
				<div className="text-base font-medium text-zinc-400 flex">
					<>Slippage Tolerance</>
					<img
						id="slippage-info"
						src="assets/info.svg"
						className="ml-1.5 w-5 h-5 cursor-pointer self-center"
					/>
					<ReactTooltip
						anchorId="slippage-info"
						place="top"
						style={{ width: "200px" }}
						content="Your buying GLP transaction will revert if the price changes unfavourably by more than this percentage."
					/>
				</div>
				<div className="flex -mx-1 pt-3">
					<div
						className="relative mx-1"
						onClick={() => dispatch(setSlippage(0.5))}
					>
						<label
							htmlFor="swap-slippage-1"
							className={`flex items-center justify-center w-12 relative z-10 p-2 cursor-pointer border-[1.5px] text-sm rounded-md font-semibold text-zinc-400 border-zinc-400 ${
								slippage == 0.5 &&
								"text-[#ff0080] border-[#ff0080] bg-opacity-80"
							}`}
						>
							0.5%
						</label>
						<input
							type="radio"
							id="swap-slippage-1"
							name="swap-slippage"
							className="w-0 h-0 opacity-0 z-0 absolute"
						/>
					</div>
					<div
						className="relative mx-1"
						onClick={() => dispatch(setSlippage(1))}
					>
						<label
							htmlFor="swap-slippage-2"
							className={`flex items-center justify-center w-12 relative z-10 p-2 cursor-pointer border-[1.5px] text-sm rounded-md font-semibold  text-zinc-400 border-zinc-400 ${
								slippage == 1 &&
								"text-[#ff0080] border-[#ff0080] bg-opacity-80"
							}`}
						>
							1%
						</label>
						<input
							type="radio"
							id="swap-slippage-2"
							name="swap-slippage"
							className="w-0 h-0 opacity-0 z-0 absolute"
						/>
					</div>
					<div
						className="relative mx-1"
						onClick={() => dispatch(setSlippage(3))}
					>
						<label
							htmlFor="swap-slippage-3"
							className={`flex items-center justify-center w-12 relative z-10 p-2 cursor-pointer border-[1.5px] text-sm rounded-md font-semibold  text-zinc-400 border-zinc-400 ${
								slippage == 3 &&
								"text-[#ff0080] border-[#ff0080] bg-opacity-80"
							}`}
						>
							3%
						</label>
						<input
							type="radio"
							id="swap-slippage-3"
							name="swap-slippage"
							className="w-0 h-0 opacity-0 z-0 absolute"
						/>
					</div>
					<div className="mx-1 relative">
						<input
							type="tel"
							className={`border-[1.5px] bg-[#17192E] pb-0.5 rounded-md h-full w-full px-3 focus:outline-none text-ellipsis border-zinc-400 ${
								slippage.toString() == customSlippage &&
								"text-[#ff0080] border-[#ff0080]"
							}`}
							placeholder="Custom"
							step=".001"
							min="0"
							max="50"
							value={customSlippage}
							onChange={(e) => {
								if (
									isValidSlippage(e.target.value) &&
									e.target.value != ""
								) {
									setCustomSlippage(e.target.value);
									dispatch(
										setSlippage(parseFloat(e.target.value))
									);
								}

								if (e.target.value == "") {
									dispatch(setSlippage(1));
									setCustomSlippage(e.target.value);
								}
							}}
						/>
						<span className="absolute right-3 top-2 my-auto font-medium bg-blue pl-2">
							%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
