import { RequestProps, getReq } from "../../api";

type Props = {
	fromChainId: string;
	fromTokenAddress: string;
	toChainId: string;
	toTokenAddress: string;
	fromAmount: string;
	userAddress: string;
	uniqueRoutesPerBridge?: boolean;
	sort: "output" | "gas" | "time";
	singleTxOnly: boolean;
	recipient?: string;
	bridgeWithGas?: boolean;
	includeBridges?: Array<string>;
	destinationPayload?: string;
	destinationGasLimit?: string;
};

const getQuote = async ({
	fromChainId,
	fromTokenAddress,
	toChainId,
	toTokenAddress,
	fromAmount,
	userAddress,
	uniqueRoutesPerBridge = true,
	sort,
	singleTxOnly,
	bridgeWithGas = false,
	recipient = userAddress,
	includeBridges = [],
	destinationPayload,
	destinationGasLimit,
}: Props) => {
	let path = `/quote?fromChainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${toChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${fromAmount}&userAddress=${userAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&bridgeWithGas=${bridgeWithGas}&singleTxOnly=${singleTxOnly}&recipient=${recipient}`;
	includeBridges.forEach(
		(bridge: string) => (path += `&includeBridges=${bridge}`)
	);
	if (destinationPayload) {
		path += `&destinationPayload=${destinationPayload}`;
	}
	if (destinationGasLimit) {
		path += `&destinationGasLimit=${destinationGasLimit}`;
	}

	const obj: RequestProps = {
		path,
	};
	const response = await getReq(obj);

	if (!response) {
		throw new Error("Problem fetching quotes");
	}
	return response;
};

export default getQuote;
