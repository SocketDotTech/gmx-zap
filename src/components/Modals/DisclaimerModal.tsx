import React from "react";
import { saveDisclaimerResponse } from "../../helpers";
import { PrimaryButton } from "../Button";

type DisclaimerModalProps = {
	setShowDisclaimerModal: (showDisclaimerModal: boolean) => void;
};

export const DisclaimerModal = ({
	setShowDisclaimerModal,
}: DisclaimerModalProps) => {
	return (
		<div className="fixed top-0 left-0 backdrop-blur-sm text-white z-50 overflow-y-auto h-full w-full">
			<div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-[#212641] w-11/12 sm:w-[30rem] rounded-lg shadow-[0_12px_15px_0_rgb(0,0,0,0.25)] border border-solid border-[#181B29] divide-y divide-zinc-600">
				<div className="px-3 py-4 text-white font-medium text-2xl text-center">
					Disclaimer
				</div>
				<div className="px-7 py-5">
					<ul className="list-disc pl-5">
						<li>
							This site enables users to buy GLP from any chain, with any asset, in a single transaction. It is a third-party integration, powered by Socket
						</li>
					</ul>
					<PrimaryButton
						buttonText={`Agree and Continue`}
						bgColor={"#2F4F4F"}
						onClick={() => {
							saveDisclaimerResponse();
							setShowDisclaimerModal(false);
						}}
					/>
				</div>
			</div>
		</div>
	);
};
