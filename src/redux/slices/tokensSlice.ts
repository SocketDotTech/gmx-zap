import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { NativeTokenDetail, TokenDetail } from "../../types";
import { ZERO_BIG_NUMBER } from "../../config";

export interface ITokensSliceState {
	fromTokensList: Array<TokenDetail>;
	toTokensList: Array<TokenDetail>;
	inputToken: TokenDetail;
	outputToken: TokenDetail;
	nativeToken: NativeTokenDetail;
	inputTokenBalance: number;
	inputTokenAmount: string;
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
} = tokensSlice.actions;

export default tokensSlice.reducer;
