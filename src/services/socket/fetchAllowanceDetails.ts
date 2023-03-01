import { RequestProps, getReq } from "../../api";

type Props = {
	chainId: string;
	owner: string;
	allowanceTarget: any;
	tokenAddress: string;
};

const getAllowanceDetail = async ({
	chainId,
	owner,
	allowanceTarget,
	tokenAddress,
}: Props) => {
	const obj: RequestProps = {
		path: `/approval/check-allowance?chainID=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}`,
	};
	const response = await getReq(obj);

	if (!response) {
		throw new Error("Problem checking allowance");
	}
	return response;
};

export default getAllowanceDetail;
