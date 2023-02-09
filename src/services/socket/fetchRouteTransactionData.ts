import { RequestProps, postReq } from "../../api";

type Props = {
	route: any;
	destinationCallData?: any;
};

const getRouteTransactionData = ({ route, destinationCallData }: Props) => {
	let body: any = { route: route };
	if (Object.keys(destinationCallData).length !== 0) {
		body["destinationCallData"] = destinationCallData;
	}
	const obj: RequestProps = {
		path: `/build-tx`,
		body: body,
	};
	const response: any = postReq(obj);

	if (!response) {
		throw new Error("Problem fetching route transaction data");
	}

	return response;
};

export default getRouteTransactionData;
