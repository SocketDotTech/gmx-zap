import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
	return (
		<div className="flex justify-between shadow-[0_12px_15px_0_rgb(0,0,0,0.25)] border-b border-solid border-[#181B29]">
			<img
				alt="GMX <> Socket Logo"
				src="assets/GMXxSocket.svg"
				className="ml-2"
			/>
			<div className="pt-5 pb-4 pr-4">
				<ConnectButton showBalance={false} />
			</div>
		</div>
	);
};
