import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { NativeTokenDetail, TokenDetail } from "../../types";
import { NATIVE_TOKEN_ADDRESS, ZERO_BIG_NUMBER } from "../../config";

export interface ITokensSliceState {
	fromTokensList: Array<TokenDetail>;
	toTokensList: Array<TokenDetail>;
	inputToken: TokenDetail;
	outputToken: TokenDetail;
	nativeToken: NativeTokenDetail;
	inputTokenBalance: number;
	inputTokenAmount: string;
	inputTokenPrice: number;
	inputChainNativeTokenPrice: number;
	inputChainNativeToken: {
		chainId: number;
		tokenAddress: string;
		userAddress: string;
		balance: string;
		decimals: number;
		symbol: string;
		name: string;
	};
}

const initTokenDetail: TokenDetail = {
	chainId: 0,
	symbol: "",
	icon: "",
	name: "",
	address: "",
	decimals: 0,
};

const initialState: ITokensSliceState = {
	inputToken: initTokenDetail,
	outputToken: initTokenDetail,
	fromTokensList: [],
	toTokensList: [],
	nativeToken: {
		name: "",
		price: ZERO_BIG_NUMBER,
		address: "",
		symbol: "",
	},
	inputTokenBalance: 0,
	inputTokenAmount: "",
	inputTokenPrice: 0,
	inputChainNativeTokenPrice: 0,
	inputChainNativeToken: {
		chainId: 0,
		tokenAddress: NATIVE_TOKEN_ADDRESS,
		userAddress: "",
		balance: "0",
		decimals: 0,
		symbol: "",
		name: "",
	},
};

export const tokensSlice = createSlice({
	name: "tokens",
	initialState,
	reducers: {
		setFromTokensList: (
			state,
			action: PayloadAction<Array<TokenDetail>>
		) => {
			state.fromTokensList = action.payload;
		},
		setToTokensList: (state, action: PayloadAction<Array<TokenDetail>>) => {
			state.toTokensList = action.payload;
		},
		setInputToken: (state, action: PayloadAction<TokenDetail>) => {
			state.inputToken = action.payload;
		},
		setOutputToken: (state, action: PayloadAction<TokenDetail>) => {
			state.outputToken = action.payload;
		},
		setNativeToken: (state, action: PayloadAction<NativeTokenDetail>) => {
			state.nativeToken = action.payload;
		},
		setInputTokenBalance: (state, action: PayloadAction<number>) => {
			state.inputTokenBalance = action.payload;
		},
		setInputTokenAmount: (state, action: PayloadAction<string>) => {
			state.inputTokenAmount = action.payload;
		},
		setInputTokenPrice: (state, action: PayloadAction<number>) => {
			state.inputTokenPrice = action.payload;
		},
		setInputChainNativeTokenPrice: (
			state,
			action: PayloadAction<number>
		) => {
			state.inputChainNativeTokenPrice = action.payload;
		},
		setInputChainNativeToken: (state, action: PayloadAction<any>) => {
			state.inputChainNativeToken = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setFromTokensList,
	setToTokensList,
	setInputToken,
	setOutputToken,
	setNativeToken,
	setInputTokenBalance,
	setInputTokenAmount,
	setInputTokenPrice,
	setInputChainNativeTokenPrice,
	setInputChainNativeToken,
} = tokensSlice.actions;

export default tokensSlice.reducer;
