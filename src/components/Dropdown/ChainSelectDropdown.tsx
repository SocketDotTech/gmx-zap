import React, { useRef } from "react";
import { useClickAway } from "../../hooks";
import { ChainDetail } from "../../types";

type Props = {
	options: Array<ChainDetail>;
	setChain: (chainId: number) => void;
	onHide: (value: boolean) => void;
};

const ChainSelectDropdown = ({ options, setChain, onHide }: Props) => {
	const clickAwayRef = useRef<HTMLDivElement>(null);

	useClickAway(clickAwayRef, () => onHide(true));

	return (
		<div
			ref={clickAwayRef}
			className="absolute text-white bg-[#141529] top-16 left-4 py-2 rounded z-10 border border-[#23263b]"
			style={{ width: "220px" }}
		>
			{options.map((option) => {
				return (
					<div
						className="flex mx-2 p-1 rounded h-10 items-center text-lg font-semibold hover:cursor-pointer hover:bg-[#2F3043]"
						onClick={() => {
							setChain(option.chainId);
							onHide(true);
						}}
						key={option.chainId}
					>
						<img
							src={option.icon}
							className="w-6 h-6 rounded-md mr-2"
						/>
						<div>{option.name}</div>
					</div>
				);
			})}
		</div>
	);
};

export default ChainSelectDropdown;
