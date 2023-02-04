import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { ZERO_BIG_NUMBER } from "../../config";

export interface IGlpSliceState {
	glpPrice: BigNumber;
	walletBalance: BigNumber;
	stakedBalance: BigNumber;
	apr: BigNumber;
	totalSupply: BigNumber;
}

const initialState: IGlpSliceState = {
	glpPrice: ZERO_BIG_NUMBER,
	walletBalance: ZERO_BIG_NUMBER,
	stakedBalance: ZERO_BIG_NUMBER,
	apr: ZERO_BIG_NUMBER,
	totalSupply: ZERO_BIG_NUMBER,
};

export const glpSlice = createSlice({
	name: "glp",
	initialState,
	reducers: {
		setGlpPrice: (state, action: PayloadAction<BigNumber>) => {
			state.glpPrice = action.payload;
		},
		setWalletBalance: (state, action: PayloadAction<BigNumber>) => {
			state.walletBalance = action.payload;
		},
		setStakedBalance: (state, action: PayloadAction<BigNumber>) => {
			state.stakedBalance = action.payload;
		},
		setApr: (state, action: PayloadAction<BigNumber>) => {
			state.apr = action.payload;
		},
		setTotalSupply: (state, action: PayloadAction<BigNumber>) => {
			state.totalSupply = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setGlpPrice,
	setWalletBalance,
	setStakedBalance,
	setApr,
	setTotalSupply,
} = glpSlice.actions;

export default glpSlice.reducer;
