import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl, USD_DECIMALS } from "../../config";
import { formatAmount } from "../../helpers";

type Props = {
	userAddress?: string;
	chainId: number;
};

const getGlpStats = async ({ chainId }: Props) => {
	const rpcUrl = getRpcUrl(chainId);
	const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
	const glpManagerContract = new ethers.Contract(
		CONTRACTS[chainId]["GlpManager"],
		abis.glpManagerAbi,
		provider
	);

	const glpPrice = await glpManagerContract.getPrice(true);
	const glpPriceUsd = formatAmount(glpPrice, USD_DECIMALS, 3, true);
	return { glpPrice: glpPriceUsd };
};

export default getGlpStats;
