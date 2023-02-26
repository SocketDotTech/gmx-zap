import React from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { AVALANCHE } from "../../config";
import { formatAmount, saveTxDetails } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setTxDetails } from "../../redux";
import { getBridgeStatus } from "../../services";

export const TxInfo = ({ txDetail }: { txDetail: any }) => {
	const dispatch = useAppDispatch();
	const { address } = useAccount();
	const { chainsInfo } = useAppSelector((state) => state.chains);

	useQuery(
		[`bridgeStatus${txDetail.sourceTransactionHash}`],
		() =>
			getBridgeStatus({
				transactionHash: txDetail.sourceTransactionHash,
				fromChainId: txDetail.fromChainId.toString(),
				toChainId: txDetail.toChainId.toString(),
			}),
		{
			enabled: !!!txDetail.isCompleted,
			onSuccess: (data: any) => {
				const response = data?.data?.result;
				const prevTxDetails = saveTxDetails(
					address!,
					response.sourceTransactionHash,
					response?.destinationTxStatus == "COMPLETED" ? true : false,
					response
				);
				dispatch(setTxDetails({ prevTxDetails: prevTxDetails }));
			},
			refetchInterval: 10000,
		}
	);

	return (
		<div className="py-3 flex justify-between">
			<div className="flex flex-col text-zinc-400">
				<div className="flex">
					<img
						src="assets/time.png"
						className="h-5 w-5 self-center mr-1"
					/>
					<span className="font-medium text-sm">
						{new Date(txDetail?.timestamp).toDateString()}
					</span>
				</div>
				<a
					href={`https://socketscan.io/tx/${txDetail?.sourceTransactionHash}`}
					target="_blank"
					className="cursor-pointer hover:underline text-xs"
				>
					{txDetail.isCompleted
						? "Tx completed (Track it here)"
						: "Tx pending (Track it here)"}
				</a>
				{/* </button> */}
			</div>

			<div className="mr-3">
				<div className="flex ">
					<div className="relative bg-gray-200 rounded-full w-7 h-7 mr-2">
						<img
							className="w-7 h-7 object-cover rounded-full bg-gray-400"
							src={txDetail?.fromAsset?.icon}
						/>
						<img
							className="w-4 h-4 absolute -right-1 -bottom-1 rounded-full object-cover bg-gray-200"
							src={chainsInfo[txDetail?.fromChainId].icon}
						/>
					</div>
					<div className="pl-1">
						<div className="text-sm text-white font-semibold leading-5">
							{formatAmount(
								txDetail?.fromAmount,
								txDetail?.fromAsset?.decimals,
								3
							)}{" "}
							{txDetail?.fromAsset?.symbol}
						</div>
						<div className="text-xs text-zinc-500 font-medium">
							on {chainsInfo[txDetail?.fromChainId].name}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="flex pr-1">
					<div>
						<img
							src={`assets/${
								txDetail?.toChainId == AVALANCHE
									? "ic_glp_avax.svg"
									: "ic_glp_arbitrum.svg"
							}`}
							alt="IC Glp Logo"
							className="w-8 h-8"
						/>
					</div>
					<div className="pl-1">
						<div className="text-sm text-white font-semibold leading-5">
							{txDetail?.glpDetail?.amount}{" "}
							{txDetail?.glpDetail?.symbol}
						</div>
						<div className="text-xs text-zinc-500 font-medium">
							on Arbitrum
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
