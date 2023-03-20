import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
	return (
		<div className="flex px-5 sm:px-8 py-2 justify-between shadow-[0_12px_15px_0_rgb(0,0,0,0.25)] border-b border-solid border-[#181B29]">
			<div className="flex flex-row">
				<a href="/" className="mr-[28px]">
					<img src="assets/socketLogo.png" className="h-12 md:h-16" />
				</a>
				<a
					href="https://bungee.exchange/refuel"
					target="_blank"
					className="mx-[32px] flex items-center hover:text-white text-lg font-semibold text-zinc-400"
				>
					Refuel
				</a>
			</div>
			<div className="flex self-center">
				<ConnectButton showBalance={false} />
			</div>
		</div>
	);
};
