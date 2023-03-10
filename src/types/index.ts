import { BigNumber } from "ethers";

export type ChainDetail = {
	chainId: number;
	name: string;
	icon: string;
	explorers: Array<string>;
	currency: any;
};

// chainID : {}
export type ChainsDetailObj = {
	[x: number]: ChainDetail;
};

export type TokenDetail = {
	address: string;
	symbol: string;
	icon: string;
	name: string;
	decimals: number;
	chainId: number;
};

export type NativeTokenDetail = {
	name: string;
	price: BigNumber;
	address: string;
	symbol: string;
};

export type Obj = {
	[key: number | string]: Object;
};

export type queryResponseObj = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	isFetching: boolean;
	error: Object | null;
	data: responseObj | undefined;
};

export type responseObj = {
	data:
		| {
				success: boolean;
				result: {
					[key: number | string]: any;
				};
		  }
		| undefined;
};

export type SortType = "output" | "time" | "gas";

export type useWeb3ProviderContent = {
	account: string;
	chainId: number;
	signer: any;
	w3Provider: any;
};

export type PropsContent = {
	defaultInputChainId: number;
	defaultOutputChainId: number;
};

export type ChainIdContent = {
	inputChainId: number;
	outputChainId: number;
	setInputChainId: (chainId: number) => void;
	setOutputChainId: (chainId: number) => void;
};

export type TabIndexContent = {
	tabIndex: number;
	setTabIndex: (index: number) => void;
};

export type TokenDetailsContent = {
	inputTokenDetails: TokenDetail;
	outputTokenDetails: TokenDetail;
	setInputTokenDetails: (Obj: TokenDetail) => void;
	setOutputTokenDetails: (Obj: TokenDetail) => void;
};

export type InputTokenAmountContent = {
	inputTokenAmount: string;
	setInputTokenAmount: (amount: string) => void;
	inputTokenList: any;
	outputTokenList: any;
};

export type RoutesContent = {
	selectedRoute: any;
	routes: Array<any>;
	setRoutes: (routes: []) => void;
	setSelectedRoute: (routes: any) => void;
};

export type SortTypeContent = {
	sortType: SortType;
	setSortType: (type: string) => void;
};
