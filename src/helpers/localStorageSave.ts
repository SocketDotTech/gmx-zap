import { disclaimerProperty } from "../config";

export const saveTxDetails = (
	account: string,
	srcTxHash: string,
	isCompleted: boolean,
	value: any,
	glpDetail?: any,
	fromAsset?: any,
	fromAmount?: any
): void => {
	const prevTxDetails = JSON.parse(localStorage.getItem("txData") ?? "{}");
	const prevTxDetailsAccount = prevTxDetails[account];

	// create account key if doesn't exist
	if (!prevTxDetailsAccount) prevTxDetails[account] = {};
	const prevTxDetailsSrcHash = prevTxDetails[account][srcTxHash];

	if (prevTxDetailsSrcHash) {
		prevTxDetails[account] = {
			...prevTxDetails[account],
			[srcTxHash]: {
				...prevTxDetailsSrcHash,
				...value,
				isCompleted: isCompleted,
			},
		};
	} else {
		// create srcTxHash key if it doesn't exist
		prevTxDetails[account] = {
			...prevTxDetails[account],
			[srcTxHash]: {
				...value,
				isCompleted: isCompleted,
				timestamp: Date.now(),
				glpDetail: glpDetail,
				fromAsset: fromAsset,
				fromAmount: fromAmount,
			},
		};
	}

	localStorage.setItem("txData", JSON.stringify(prevTxDetails));
	return prevTxDetails;
};

export const saveDisclaimerResponse = () => {
	localStorage.setItem(disclaimerProperty, "true");
};
