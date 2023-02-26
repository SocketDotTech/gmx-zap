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

const regExpForValidInput = new RegExp(/^\d*\.?\d*$/);
const regExpForValidSlippage = new RegExp(
	/^(50(?:\.0{0,2})?|[0-4]?[0-9](?:\.[0-9]{0,2})?)$/
);

export const isValidInput = (ch: any) => {
	if (regExpForValidInput.test(ch)) {
		return true;
	} else {
		return false;
	}
};

export const isValidSlippage = (ch: any) => {
	if (regExpForValidSlippage.test(ch)) {
		return true;
	} else {
		return false;
	}
};

export * from "./numbers";
export * from "./gas";
export * from "./DataHelper";
export * from "./localStorageSave";
