import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { swapChainsCompatible } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { InputChainSelect } from "./InputChainSelect";
import { OutputChainSelect } from "./OutputChainSelect";
import { getChainDataByChainId } from "../../helpers";
import {
	setChainsInfo,
	setInputChainId,
	setInputChainsList,
	setOutputChainId,
	setOutputChainsList,
} from "../../redux";
import { getSupportedChains } from "../../services";

const ChainsSelect: React.FC = () => {
	const dispatch = useAppDispatch();
	const chainsResponse = useQuery(["chains"], getSupportedChains, {
		refetchOnWindowFocus: false,
	});
	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);

	const [swapEnable, setSwapEnable] = useState(false);

	useEffect(() => {
		if (
			Object.keys(chainsResponse).length === 0 ||
			!chainsResponse.isSuccess
		)
			return;

		const { chainsByChainId, fromChainsList, toChainsList } =
			getChainDataByChainId(chainsResponse);

		dispatch(setChainsInfo(chainsByChainId));
		dispatch(setInputChainsList(fromChainsList));
		dispatch(setOutputChainsList(toChainsList));
		if (inputChainId === 0)
			dispatch(setInputChainId(fromChainsList[0].chainId));
		if (outputChainId === 0)
			dispatch(setOutputChainId(toChainsList[0].chainId));
	}, [chainsResponse.isSuccess]);

	useEffect(() => {
		if (swapChainsCompatible(outputChainId, inputChainId))
			setSwapEnable(true);
		else setSwapEnable(false);
	}, [inputChainId, outputChainId]);

	return (
		<div
			id="chain-select"
			className={`${"sm:grid sm:grid-cols-11 flex flex-col"} gap-3 rounded-xl`}
		>
			<InputChainSelect />
			<div
				id="swap-chains"
				className="self-center text-white hidden sm:block"
			>
				<div
					className={`flex justify-center items-center h-7 ${
						!swapEnable
							? "hover:cursor-not-allowed"
							: "hover:cursor-pointer"
					}`}
					onClick={() => {
						if (!swapEnable) return;
						dispatch(setInputChainId(outputChainId));
					}}
				>
					<img
						src={"assets/ic_convert_down.svg"}
						className="-rotate-90"
					/>
				</div>
			</div>

			<OutputChainSelect />
		</div>
	);
};

export default ChainsSelect;
