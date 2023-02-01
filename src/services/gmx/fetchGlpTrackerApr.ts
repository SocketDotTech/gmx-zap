import { BigNumber, ethers } from "ethers";
import {
	abis,
	BASIS_POINTS_DIVISOR,
	CONTRACTS,
	getRpcUrl,
	GLP_DECIMALS,
	SECONDS_PER_YEAR,
} from "../../config";
import { expandDecimals } from "../../helpers";
import { NativeTokenDetail } from "../../types";

type Props = {
	userAddress: string;
	chainId: number;
	glpPrice: BigNumber;
	nativeToken: NativeTokenDetail;
};

const getStakingData = (stakingInfo: Array<BigNumber>) => {
	if (!stakingInfo || stakingInfo.length === 0) {
		return;
	}

	const keys = ["stakedGlpTracker", "feeGlpTracker"];
	const data: {
		[x: string]: any;
	} = {};
	const propsLength = 5;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		data[key] = {
			claimable: stakingInfo[i * propsLength],
			tokensPerInterval: stakingInfo[i * propsLength + 1],
			averageStakedAmounts: stakingInfo[i * propsLength + 2],
			cumulativeRewards: stakingInfo[i * propsLength + 3],
			totalSupply: stakingInfo[i * propsLength + 4],
		};
	}

	return data;
};

const getGlpTrackerApr = async ({
	userAddress,
	chainId,
	glpPrice,
	nativeToken,
}: Props) => {
	const rpcUrl = getRpcUrl(chainId);
	const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
	const readerContract = new ethers.Contract(
		CONTRACTS[chainId]["Reader"],
		abis.readerAbi,
		provider
	);
	const rewardReaderContract = new ethers.Contract(
		CONTRACTS[chainId]["RewardReader"],
		abis.rewardReaderAbi,
		provider
	);

	const balancesAndSupplies =
		await readerContract.getTokenBalancesWithSupplies(userAddress, [
			CONTRACTS[chainId]["StakedGlpTracker"],
			CONTRACTS[chainId]["USDG"],
		]);

	const stakingInfo = await rewardReaderContract.getStakingInfo(userAddress, [
		CONTRACTS[chainId]["StakedGlpTracker"],
		CONTRACTS[chainId]["FeeGlpTracker"],
	]);

	const stakingData = getStakingData(stakingInfo);

	const glpSupply = balancesAndSupplies[1];
	const glpSupplyUsd = glpSupply
		.mul(glpPrice)
		.div(expandDecimals(1, GLP_DECIMALS));

	let feeGlpTrackerAnnualRewardsUsd;
	let feeGlpTrackerApr;

	if (
		stakingData &&
		stakingData.feeGlpTracker &&
		stakingData.feeGlpTracker.tokensPerInterval &&
		nativeToken &&
		nativeToken.price &&
		glpSupplyUsd &&
		glpSupplyUsd.gt(0)
	) {
		feeGlpTrackerAnnualRewardsUsd =
			stakingData.feeGlpTracker.tokensPerInterval
				.mul(SECONDS_PER_YEAR)
				.mul(nativeToken.price)
				.div(expandDecimals(1, 18));
		feeGlpTrackerApr = feeGlpTrackerAnnualRewardsUsd
			.mul(BASIS_POINTS_DIVISOR)
			.div(glpSupplyUsd);
	}

	return { feeGlpTrackerApr };
};

export default getGlpTrackerApr;
