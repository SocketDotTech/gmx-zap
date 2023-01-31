import React from "react";
import { ChainsSelect } from "../ChainSelect";
import { TokensDetail } from "../TokenDetail";

const GlpBuyWidget = () => {
	return (
		<>
			{/* GLP Bridge Widget */}
			<div className="max-w-[30rem] w-full bg-[#17192E] rounded border border-[#23263b] max-[900px]:min-w-full p-3">
				<div className="pb-3">
					<ChainsSelect />
				</div>
				<div>
					<TokensDetail />
				</div>
			</div>
		</>
	);
};

export default GlpBuyWidget;
