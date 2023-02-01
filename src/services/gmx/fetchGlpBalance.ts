import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl } from "../../config";

type Props = {
	userAddress: string;
	chainId: number;
};

const getGlpBalance = async ({ userAddress, chainId }: Props) => {
	const rpcUrl = getRpcUrl(chainId);
	const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
	const feeGlpTrackerContract = new ethers.Contract(
		CONTRACTS[chainId]["FeeGlpTracker"],
		abis.feeGlpTrackerAbi,
		provider
	);

	const glpWalletBalance = await feeGlpTrackerContract.stakedAmounts(
		userAddress
	);

	return { glpWalletBalance };
};

export default getGlpBalance;
