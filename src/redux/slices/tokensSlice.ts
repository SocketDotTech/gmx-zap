import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TokenDetail } from "../../types";

export interface ITokensSliceState {
	fromTokensList: Array<TokenDetail>;
	toTokensList: Array<TokenDetail>;
	inputToken: TokenDetail;
	outputToken: TokenDetail;
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
};

export const tokensSlice = createSlice({
	name: "chains",
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
	},
});

// Action creators are generated for each case reducer function
export const {
	setFromTokensList,
	setToTokensList,
	setInputToken,
	setOutputToken,
} = tokensSlice.actions;

export default tokensSlice.reducer;
