import { RequestProps, getReq } from "../../api";

type Props = {
	chainId: string;
	owner: string;
	allowanceTarget: any;
	tokenAddress: string;
	amount: string;
};

const getApprovalTxData = async ({
	chainId,
	owner,
	allowanceTarget,
	tokenAddress,
	amount,
}: Props) => {
	const obj: RequestProps = {
		path: `/approval/build-tx?chainID=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}&amount=${amount}`,
	};
	const response = await getReq(obj);

	if (!response) {
		throw new Error("Problem getting approval transaction data");
	}
	return response;
};

export default getApprovalTxData;
