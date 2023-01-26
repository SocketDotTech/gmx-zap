import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
	return (
		<div className="flex justify-center mt-20">
			<ConnectButton showBalance={false} />
		</div>
	);
};

export default Header;
