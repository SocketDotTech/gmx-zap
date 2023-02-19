import { RequestProps, postReq } from "../../api";

type Props = {
	route: any;
	destinationCallData?: any;
	refuel?: any;
};

const getRouteTransactionData = ({
	route,
	destinationCallData,
	refuel,
}: Props) => {
	let body: any = { route: route };
	if (Object.keys(destinationCallData).length !== 0) {
		body["destinationCallData"] = destinationCallData;
	}
	if (refuel) {
		body["refuel"] = refuel;
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
