import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setTxDetails } from "../../redux";
import { TxInfo } from "./TxInfo";

type TxnHistoryProps = {
	setTabIndex: (tabIndex: number) => void;
};

export const TxnHistory = ({ setTabIndex }: TxnHistoryProps) => {
	const { address } = useAccount();
	const dispatch = useAppDispatch();
	const { txDetails } = useAppSelector((state) => state.txDetails);
	const [txDetailsAcc, setTxDetailsAcc] = useState({});
	const [pendingTxn, setPendingTxn] = useState<Array<{}> | null>(null);
	const [completedTxn, setCompletedTxn] = useState<Array<{}> | null>(null);
	const [selectedHistory, setSelectedHistory] = useState(0); // 0 -> Pending, 1 -> Completed

	useEffect(() => {
		(async function () {
			if (!address) return;
			const prevTxDetails = Object.assign({}, txDetails);
			const prevTxDetailsAccount = prevTxDetails[address];

			// create address key if doesn't exist
			if (
				!prevTxDetailsAccount ||
				Object.keys(prevTxDetailsAccount).length === 0
			) {
				if (!prevTxDetailsAccount) {
					prevTxDetails[address] = {};
					localStorage.setItem(
						"txData",
						JSON.stringify(prevTxDetails)
					);
					dispatch(setTxDetails({ prevTxDetails: prevTxDetails }));
				}
				setTxDetailsAcc({});
				setPendingTxn([]);
				setCompletedTxn([]);
				return;
			}

			const pendingTxs: Array<{}> = [],
				completedTxs: Array<{}> = [];
			Object.keys(prevTxDetailsAccount).map((txData) => {
				if (prevTxDetailsAccount[txData].isCompleted == false)
					pendingTxs.push(prevTxDetailsAccount[txData]);
				else if (prevTxDetailsAccount[txData].isCompleted == true)
					completedTxs.push(prevTxDetailsAccount[txData]);
			});
			setPendingTxn(pendingTxs);
			setCompletedTxn(completedTxs);
			setTxDetailsAcc(prevTxDetailsAccount);
		})();
	}, [txDetails, address]);

	return (
		<>
			<div className="flex flex-row" id="tx-history-header">
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
				<div className="grow text-center text-xl text-white font-medium">
					Transactions History
				</div>
			</div>
			<>
				{Object.keys(txDetailsAcc).length === 0 ? (
					<>
						<div className="mt-16 flex flex-col items-center px-8">
							<img
								onClick={() => setTabIndex(2)}
								id="history-icon-info"
								src="assets/history.png"
								className="h-16 w-16 self-center"
							/>
							<span className="font-bold pt-3 text-zinc-400 text-xl">
								No Recent Transactions
							</span>
							<span className="font-medium py-4 text-zinc-400 text-center text-sm">
								Tx History is stored locally and will be deleted
								if browser cache is cleared.
							</span>
						</div>
					</>
				) : (
					<>
						<div className="px-3">
							<div className="flex justify-between pt-6 text-md text-zinc-400 font-medium">
								<div>Transactions</div>
								<div className="flex">
									<div
										className={`pr-5 cursor-pointer flex items-center ${
											selectedHistory !== 0 &&
											"opacity-70"
										}`}
										onClick={() => setSelectedHistory(0)}
									>
										<div
											className={`w-5 h-5 rounded-full mr-1 items-center justify-center ${
												selectedHistory === 0
													? "bg-[#EE9500]"
													: "bg-[#9CA3AF]"
											}`}
										>
											<img
												src="./assets/loading.svg"
												className={`h-5 w-5 text-zinc-400 p-[4px] ${
													selectedHistory === 0 &&
													"animate-spin"
												}`}
											/>
										</div>
										Pending
									</div>
									<div
										className={`pr-3 cursor-pointer flex items-center ${
											selectedHistory !== 1 &&
											"opacity-70"
										}`}
										onClick={() => setSelectedHistory(1)}
									>
										<div
											className={`w-5 h-5 rounded-full mr-1 items-center justify-center `}
										>
											<img
												src="./assets/green-tick.svg"
												className={`h-5 w-5 text-zinc-400 ${
													selectedHistory !== 1 &&
													"opacity-40"
												}`}
											/>
										</div>
										Completed
									</div>
								</div>
							</div>
							<div className="text-xs text-center py-2 mt-3 rounded bg-[#2F4F4F] text-white">
								Transaction status is updated every 10 seconds
							</div>
							<div className="my-6 mt-4 max-h-72 overflow-auto">
								{selectedHistory == 0 &&
									pendingTxn &&
									pendingTxn.length > 0 &&
									pendingTxn.map((tx: any) => (
										<TxInfo
											txDetail={tx}
											key={tx.sourceTransactionHash}
										/>
									))}
								{selectedHistory == 0 &&
									(!pendingTxn || pendingTxn.length == 0) && (
										<div>No pending transactions</div>
									)}
								{selectedHistory == 1 &&
									completedTxn &&
									completedTxn.length > 0 &&
									completedTxn.map((tx: any) => (
										<TxInfo
											txDetail={tx}
											key={tx.sourceTransactionHash}
										/>
									))}
								{selectedHistory == 1 &&
									(!completedTxn ||
										completedTxn.length == 0) && (
										<div className="text-zinc-400 font-medium">
											No completed transactions
										</div>
									)}
							</div>
						</div>
					</>
				)}
			</>
		</>
	);
};
