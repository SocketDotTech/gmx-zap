import { supportedInputChains, supportedOutputChains } from "../config";

export { getChainDataByChainId } from "./DataHelper";

export const swapChainsCompatible = (
	inputChainId: number,
	outputChainId: number
): boolean => {
	if (
		supportedOutputChains.includes(outputChainId) &&
		supportedInputChains.includes(inputChainId)
	)
		return true;
	return false;
};

const regExp = new RegExp(/^\d*\.?\d*$/);

export const isValidInput = (ch: any) => {
	if (regExp.test(ch)) {
		return true;
	} else {
		return false;
	}
};

export * from "./numbers";
export * from "./gas";
