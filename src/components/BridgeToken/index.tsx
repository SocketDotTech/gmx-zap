import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
	getAllowanceDetail,
	getApprovalTxData,
	getBridgeStatus,
	getRouteTransactionData,
} from "../../services";

import { queryResponseObj } from "../../types";
import { PrimaryButton, SwitchNetworkButton } from "../Button";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { bigNumberify, formatAmount, saveTxDetails } from "../../helpers";
import { setTxDetails } from "../../redux";
// let bridgeStatus: queryResponseObj;

type BridgeTokensProps = {
	route: any;
	refuel: any;
	destinationCallData: any;
	glpReceived: string;
	setTabIndex: (tab: number) => void;
};

export const BridgeTokens = ({
	route,
	refuel,
	destinationCallData,
	glpReceived,
	setTabIndex,
}: BridgeTokensProps) => {
	const { chain } = useNetwork();
	const { address } = useAccount();
	const dispatch = useAppDispatch();
	const { data: signer } = useSigner();
	const provider = useProvider();
	const { inputToken, inputChainNativeToken } = useAppSelector(
		(state) => state.tokens
	);
	const { inputChainId, outputChainId, chainsInfo } = useAppSelector(
		(state) => state.chains
	);
	const { enabledRefuel } = useAppSelector((state) => state.refuel);

	const [loading, setLoading] = useState(true);
	const [allowanceTarget, setAllowanceTarget] = useState(null);
	const [apiTxData, setApiTxData] = useState({} as any);
	const [minimumApprovalAmount, setMinimumApprovalAmount] = useState(null);
	const [approveBtnText, setApproveBtnText] = useState("Approve");
	const [bridgeBtnText, setBridgeBtnText] = useState("Bridge");
	const [hideApproveBtn, setHideApproveBtn] = useState(true);
	const [hideBridgeBtn, setHideBridgeBtn] = useState(true);
	const [loadingApproveBtn, setLoadingApproveBtn] = useState(false);
	const [loadingBridgeBtn, setLoadingBridgeBtn] = useState(false);
	const [disabledApproveBtn, setDisabledApproveBtn] = useState(false);
	const [disabledBridgeBtn, setDisabledBridgeBtn] = useState(false);
	const [warning, setWarning] = useState("");
	const [sourceTxHash, setSourceTxHash] = useState("");
	const [destinationTxHash, setDestinationTxHash] = useState("");

	const isFirstMount = useRef(true);

	const inputAmountSimplified =
		(parseFloat(route.fromAmount) / 10 ** inputToken.decimals)
			.toFixed(4)
			.toString() +
		" " +
		inputToken.symbol;

	// const bridgeName = route.usedBridgeNames[0];

	useQuery(
		["checkAllowance", allowanceTarget],
		() =>
			getAllowanceDetail({
				chainId: inputChainId.toString(),
				owner: address!,
				allowanceTarget: allowanceTarget,
				tokenAddress: inputToken.address,
			}),
		{
			onSuccess: (data: any) => {
				const allowanceValue = parseInt(data?.data?.result?.value);
				if (
					minimumApprovalAmount != null &&
					parseInt(minimumApprovalAmount) > allowanceValue
				) {
					setDisabledBridgeBtn(true);
					setHideApproveBtn(false);
					setHideBridgeBtn(false);
				} else if (
					minimumApprovalAmount != null &&
					parseInt(minimumApprovalAmount) <= allowanceValue
				) {
					setHideBridgeBtn(false);
				}
			},
			enabled: !!allowanceTarget,
		}
	);

	const bridgeStatus: queryResponseObj = useQuery(
		["bridgeStatus", sourceTxHash],
		() =>
			getBridgeStatus({
				transactionHash: sourceTxHash,
				fromChainId: inputChainId.toString(),
				toChainId: outputChainId.toString(),
			}),
		{
			enabled: !!(
				sourceTxHash !== "" &&
				destinationTxHash === "" &&
				address
			),
			onSuccess: async (data) => {
				const response: any = data?.data?.result;
				const glpDetail = {
					symbol: "GLP",
					amount: glpReceived,
				};
				const prevTxDetails = saveTxDetails(
					address!,
					sourceTxHash,
					response?.destinationTxStatus === "COMPLETED"
						? true
						: false,
					response,
					glpDetail,
					inputToken,
					route.fromAmount
				);
				dispatch(setTxDetails({ prevTxDetails: prevTxDetails }));
			},
			// refetchInterval: 20000,
		}
	);

	const routeTxData = useMutation(["routeTxData"], getRouteTransactionData, {
		onSuccess: (data: any) => {
			setLoading(false);
			setApiTxData(data.data?.result);
			const { allowanceTarget, minimumApprovalAmount } =
				data.data.result.approvalData;
			setMinimumApprovalAmount(minimumApprovalAmount);
			if (allowanceTarget === null) {
				setHideBridgeBtn(false);
			} else {
				setAllowanceTarget(allowanceTarget);
			}
		},
	});

	useEffect(() => {
		if (bridgeStatus.isSuccess) {
			const response: any = bridgeStatus.data?.data?.result;
			if (
				response.destinationTransactionHash != null &&
				response.destinationTxStatus === "COMPLETED"
			) {
				setDestinationTxHash(response.destinationTransactionHash);
			}
		}
	}, [bridgeStatus.isSuccess, bridgeStatus.isFetching, destinationTxHash]);

	// run this effect on only first mount of this component
	useEffect(() => {
		if (isFirstMount.current) {
			if (enabledRefuel) {
				routeTxData.mutate({
					route: route,
					refuel: refuel,
					destinationCallData: destinationCallData,
				});
			} else {
				routeTxData.mutate({
					route: route,
					destinationCallData: destinationCallData,
				});
			}
			isFirstMount.current = false;
		}
	}, [isFirstMount]);

	// const gasLimitFromRoute = () => {
	// 	if (Object.keys(route).length === 0) return;
	// 	let userBridgeTx = {} as any;
	// 	route.userTxs.map((userTx: any) => {
	// 		if (userTx.userTxType === "fund-movr") {
	// 			userBridgeTx = userTx;
	// 		}
	// 	});

	// 	let gasLimit = userBridgeTx.gasFees.gasLimit;
	// 	return gasLimit;
	// };

	const handleApprove = async () => {
		if (!minimumApprovalAmount) return;

		try {
			setDisabledApproveBtn(true);
			setLoadingApproveBtn(true);
			setApproveBtnText("Approving...");

			const approvalTransactionData: any = await getApprovalTxData({
				chainId: inputChainId.toString(),
				owner: address!,
				allowanceTarget: allowanceTarget,
				tokenAddress: inputToken.address,
				amount: minimumApprovalAmount,
			});

			const gasPrice = await signer!.getGasPrice();

			const gasEstimate = await provider.estimateGas({
				from: address!,
				to: approvalTransactionData.data?.result?.to,
				value: "0x00",
				data: approvalTransactionData.data?.result?.data,
				gasPrice: gasPrice,
			});

			const tx = await signer!.sendTransaction({
				from: approvalTransactionData.data?.result?.from,
				to: approvalTransactionData.data?.result?.to,
				value: "0x00",
				data: approvalTransactionData.data?.result?.data,
				gasPrice: gasPrice,
				gasLimit: gasEstimate,
			});

			// Initiates approval transaction on user's frontend which user has to sign
			const receipt = await tx.wait();

			console.log("Approval Transaction Hash :", receipt.transactionHash);

			setLoadingApproveBtn(false);
			setApproveBtnText("Approved");
			setTimeout(() => {
				setHideApproveBtn(true);
				setDisabledBridgeBtn(false);
			}, 1000);
		} catch (err: any) {
			console.error(err.reason || err.data.message);
			setWarning(err.reason || err.data.message);
			setTimeout(() => {
				setWarning("");
			}, 5000);
			setDisabledApproveBtn(false);
			setLoadingApproveBtn(false);
			setApproveBtnText("Approve");
		}
	};

	const handleBridge = async () => {
		try {
			setDisabledBridgeBtn(true);
			setLoadingBridgeBtn(true);
			setBridgeBtnText("Bridging...");

			// const gasPrice = await signer!.getGasPrice();

			// const gasEstimate = gasLimitFromRoute() + 1000;

			const tx = await signer!.sendTransaction({
				from: address,
				to: apiTxData.txTarget,
				data: apiTxData.txData,
				value: apiTxData.value,
				// gasPrice: gasPrice,
			});

			// Initiates swap/bridge transaction on user's frontend which user has to sign
			const receipt = await tx.wait();

			const txHash = receipt.transactionHash;

			console.log("Bridging Transaction : ", receipt.transactionHash);

			setLoadingBridgeBtn(false);
			// setBridgeBtnText("Bridging Tx initiated");
			setTimeout(() => {
				setHideBridgeBtn(true);
				setSourceTxHash(txHash);
			}, 3000);
		} catch (err: any) {
			console.log(err.reason || err.data.message);
			setWarning(err.reason || err.data.message);
			setTimeout(() => {
				setWarning("");
			}, 5000);
			setDisabledBridgeBtn(false);
			setLoadingBridgeBtn(false);
			setBridgeBtnText("Bridge");
		}
	};

	return (
		<div>
			<div className="flex flex-row" id="bridge-header">
				<button
					className="w-6 h-6 rounded-md hover:cursor-pointer mr-2 text-white flex justify-center items-center"
					onClick={() => setTabIndex(0)}
				>
					<img
						src="./assets/down-arrow.svg"
						className="rotate-180"
						style={{ width: 9, height: 14 }}
					/>
				</button>
				<div className="grow text-center text-2xl text-white font-medium">
					Bridge
				</div>
			</div>
			<div className="h-3"></div>
			<div className="h-4"></div>
			<div className="text-white text-xl font-medium">Bridge Info</div>
			<div className="text-zinc-400 test-base font-medium py-1">
				{inputAmountSimplified} on {chainsInfo[inputChainId]["name"]} to{" "}
				{glpReceived} GLP on {chainsInfo[outputChainId]["name"]}
				{/* via{" "}{bridgeName} bridge */}
			</div>
			{loading && (
				<div className="text-white text-base font-medium mt-4 mb-4 py-5 text-center">
					<img
						src="./assets/loading.svg"
						className="inline animate-spin -ml-1 mr-2 h-20 w-20 text-white"
					/>
				</div>
			)}
			{sourceTxHash !== "" && destinationTxHash === "" && (
				<div className="text-white text-base font-medium mt-4 mb-4 pt-5 text-center">
					{/* <img
						src="./assets/loading.svg"
						className="inline animate-spin -ml-1 mr-2 h-20 w-20 text-white"
					/> */}
					<div className="text-zinc-400 text-base font-medium pt-4">
						Bridging in Progress...
					</div>
				</div>
			)}
			{destinationTxHash !== "" && (
				<div className="py-5 flex flex-col items-center">
					<img src="./assets/green-tick.svg" className="h-20 w-20" />
					<div className="text-zinc-400 text-base font-medium pt-2">
						Transaction completed
					</div>
				</div>
			)}
			{warning && (
				<div className="mt-4 mb-4 text-base font-medium text-red-500">
					{warning}
				</div>
			)}
			{sourceTxHash === "" && chain?.id != inputChainId && (
				<div className="mt-14">
					<SwitchNetworkButton bgColor="#2E3FD9" />
				</div>
			)}
			{sourceTxHash === "" &&
				chain?.id === inputChainId &&
				"value" in apiTxData &&
				bigNumberify(apiTxData.value) &&
				bigNumberify(inputChainNativeToken.balance) &&
				bigNumberify(apiTxData.value)?.gt(
					bigNumberify(inputChainNativeToken.balance)!
				) && (
					<>
						<div className={`flex flex-row gap-4 mt-14`}>
							<PrimaryButton
								buttonText={`Not enough ${
									inputChainNativeToken?.symbol
								}. (${formatAmount(
									apiTxData?.value,
									inputChainNativeToken?.decimals
								)} required)`}
								bgColor={"gray"}
								disabled={true}
							/>
						</div>
					</>
				)}
			{sourceTxHash === "" &&
				chain?.id === inputChainId &&
				!(
					"value" in apiTxData &&
					bigNumberify(apiTxData.value) &&
					bigNumberify(inputChainNativeToken.balance) &&
					bigNumberify(apiTxData.value)?.gt(
						bigNumberify(inputChainNativeToken.balance)!
					)
				) && (
					<div className={`flex flex-row gap-4 mt-14`}>
						{!hideApproveBtn && (
							<PrimaryButton
								buttonText={approveBtnText}
								loading={loadingApproveBtn}
								bgColor={"#2E3FD9"}
								disabled={disabledApproveBtn}
								onClick={handleApprove}
								completed={approveBtnText === "Approved"}
							/>
						)}
						{!hideBridgeBtn && (
							<PrimaryButton
								buttonText={bridgeBtnText}
								loading={loadingBridgeBtn}
								bgColor={"#2E3FD9"}
								disabled={disabledBridgeBtn}
								onClick={handleBridge}
							/>
						)}
					</div>
				)}
			{sourceTxHash !== "" && chainsInfo && (
				<div className="flex flex-row justify-around mt-1">
					<button className="text-base text-white hover:underline border rounded-3xl border-zinc-400 bg-[#2E3FD9] px-2.5 py-1.5 flex flex-row">
						<img
							src={chainsInfo[inputChainId].icon}
							className="w-6 h-6 rounded-full mr-2"
						/>
						<a
							href={`https://socketscan.io/tx/${sourceTxHash}`}
							target="_blank"
						>
							Track your Tx on Socketscan.io
						</a>
					</button>
					{/* <button
						className="text-xs text-white hover:underline border disabled:pointer-events-none bg-[#2E3FD9] disabled:opacity-50 rounded-3xl border-zinc-400 px-2.5 py-1.5 flex flex-row"
						disabled={destinationTxHash === ""}
					>
						<img
							src={chainsInfo[outputChainId].icon}
							className="w-4 h-4 rounded-full mr-1"
						/>
						<a
							href={`${chainsInfo[outputChainId].explorers[0]}/tx/${destinationTxHash}`}
							target="_blank"
						>
							Destination Tx
						</a>
					</button> */}
				</div>
			)}
		</div>
	);
};
