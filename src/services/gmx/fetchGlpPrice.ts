import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl } from "../../config";

type Props = {
	chainId: number;
};

const getGlpPrice = async ({ chainId }: Props) => {
	const rpcUrl = getRpcUrl(chainId);
	const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
	const glpManagerContract = new ethers.Contract(
		CONTRACTS[chainId]["GlpManager"],
		abis.glpManagerAbi,
		provider
	);

	const glpPrice = await glpManagerContract.getPrice(true);

	return { glpPrice };
};

export default getGlpPrice;
