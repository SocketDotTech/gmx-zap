import React, { useState } from "react";

export const ReceiveGlpDetail = () => {
	const [outputTokenAmount, setOutputTokenAmount] = useState("");

	const amount = 0;
	return (
		<div
			id="receive-glp"
			className="text-white px-3 py-2 rounded border-2 border-[#23263b] flex flex-col bg-[#212641] relative"
		>
			{/* Pay - Balance */}
			<div className="flex pb-3">
				<div className="grow text-base text-zinc-400 font-medium mr-2">
					Receive: ${amount}
				</div>
			</div>
			<div className="flex space-between">
				<div className="grow text-white mr-2">
					<input
						placeholder="0"
						className="text-xl font-medium bg-transparent w-full text-left border-none outline-none"
						onChange={(e) => {
							setOutputTokenAmount(e.target.value);
						}}
						disabled
						value={outputTokenAmount}
					/>
				</div>
				<div className="text-xl font-medium text-right flex">GLP</div>
			</div>
		</div>
	);
};
