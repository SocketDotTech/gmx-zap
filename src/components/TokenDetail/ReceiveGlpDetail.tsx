import React from "react";
import { USD_DECIMALS } from "../../config";
import { formatAmount } from "../../helpers";
import { useAppSelector } from "../../hooks";

export const ReceiveGlpDetail = ({ glpReceived }: { glpReceived: string }) => {
	const { glpPrice } = useAppSelector((state) => state.glp);
	const { inputTokenAmount } = useAppSelector((state) => state.tokens);

	return (
		<div
			id="receive-glp"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			<div className="flex pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Receive: $
					{glpReceived === "" || inputTokenAmount === ""
						? "0"
						: (
								parseFloat(glpReceived) *
								parseFloat(
									formatAmount(
										glpPrice,
										USD_DECIMALS,
										10,
										true
									)
								)
						  )
								.toFixed(3)
								.toLocaleString()}
				</div>
			</div>
			<div className="flex space-between">
				<div className="grow text-white mr-2">
					<input
						placeholder="0"
						className="text-xl font-medium bg-transparent w-full text-left border-none outline-none"
						disabled
						value={
							glpReceived === "" || inputTokenAmount === ""
								? "0"
								: parseFloat(glpReceived).toString()
						}
					/>
				</div>
				<div className="text-xl font-medium text-right flex">GLP</div>
			</div>
		</div>
	);
};
