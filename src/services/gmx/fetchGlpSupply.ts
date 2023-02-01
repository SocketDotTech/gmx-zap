import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl } from "../../config";

type Props = {
	chainId: number;
};

const getGlpSupply = async ({ chainId }: Props) => {
	const rpcUrl = getRpcUrl(chainId);
	const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
	const glpTokenContract = new ethers.Contract(
		CONTRACTS[chainId]["GLP"],
		abis.glpTokenAbi,
		provider
	);

	const totalSupply = await glpTokenContract.totalSupply();

	return { totalSupply };
};

export default getGlpSupply;
