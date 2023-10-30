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

export const ChainsSelect: React.FC = () => {
	const dispatch = useAppDispatch();
	const { inputChainId, outputChainId } = useAppSelector(
		(state) => state.chains
	);

	const [swapEnable, setSwapEnable] = useState(false);

	useQuery(["chains"], getSupportedChains, {
		onSuccess: (data: any) => {
			const { chainsByChainId, fromChainsList, toChainsList } =
				getChainDataByChainId(data);

			dispatch(setChainsInfo(chainsByChainId));
			dispatch(setInputChainsList(fromChainsList));
			dispatch(setOutputChainsList(toChainsList));
			if (inputChainId === 0)
				dispatch(setInputChainId(fromChainsList[0].chainId));
			if (outputChainId === 0)
				dispatch(setOutputChainId(toChainsList[0].chainId));
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: 60000,
	});

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
