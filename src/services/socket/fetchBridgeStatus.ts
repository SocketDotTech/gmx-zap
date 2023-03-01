import { RequestProps, getReq } from "../../api";

type Props = {
	transactionHash: any;
	fromChainId: string;
	toChainId: string;
};

const getBridgeStatus = async ({
	transactionHash,
	fromChainId,
	toChainId,
}: Props) => {
	const obj: RequestProps = {
		path: `bridge-status?transactionHash=${transactionHash}&fromChainId=${fromChainId}&toChainId=${toChainId}`,
	};
	const response = await getReq(obj);

	if (!response) {
		throw new Error("Problem getting bridge tx status");
	}
	return response;
};

export default getBridgeStatus;
