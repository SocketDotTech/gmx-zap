import { BigNumberish, Contract, providers } from "ethers";
import { GAS_PRICE_ADJUSTMENT_MAP, MAX_GAS_PRICE_MAP } from "../config";
import { bigNumberify } from "./numbers";

export const setGasPrice = async (
	txnOpts: any,
	provider: providers.Web3Provider,
	chainId: number
) => {
	let maxGasPrice = MAX_GAS_PRICE_MAP[chainId];
	const premium = GAS_PRICE_ADJUSTMENT_MAP[chainId] || bigNumberify(0);

	const gasPrice = await provider.getGasPrice();

	if (maxGasPrice) {
		if (gasPrice.gt(maxGasPrice)) {
			maxGasPrice = gasPrice;
		}

		const feeData = await provider.getFeeData();

		// the wallet provider might not return maxPriorityFeePerGas in feeData
		// in which case we should fallback to the usual getGasPrice flow handled below
		if (feeData && feeData.maxPriorityFeePerGas) {
			txnOpts.maxFeePerGas = maxGasPrice;
			txnOpts.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(
				premium!
			);
			return;
		}
	}

	txnOpts.gasPrice = gasPrice.add(premium!);
	return;
};

export const getGasLimit = async (
	contract: Contract,
	method: string,
	params = [],
	value: BigNumberish
) => {
	const defaultValue = bigNumberify(0);

	if (!value) {
		value = defaultValue!;
	}

	let gasLimit = await contract.estimateGas[method](...params, { value });

	if (gasLimit.lt(22000)) {
		gasLimit = bigNumberify(22000)!;
	}

	return gasLimit.mul(11000).div(10000); // add a 10% buffer
};
