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

export * from "./numbers";
