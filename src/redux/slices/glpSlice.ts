import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TokenDetail } from "../../types";

export interface IGlpSliceState {
	glpPrice: number;
	walletBalance: number;
	stakedBalance: number;
	apr: number;
	totalSupply: number;
}

const initialState: IGlpSliceState = {
	glpPrice: 0,
	walletBalance: 0,
	stakedBalance: 0,
	apr: 0,
	totalSupply: 0,
};

export const glpSlice = createSlice({
	name: "chains",
	initialState,
	reducers: {
		setGlpPrice: (state, action: PayloadAction<number>) => {
			state.glpPrice = action.payload;
		},
		setWalletBalance: (state, action: PayloadAction<number>) => {
			state.walletBalance = action.payload;
		},
		setStakedBalance: (state, action: PayloadAction<number>) => {
			state.stakedBalance = action.payload;
		},
		setApr: (state, action: PayloadAction<number>) => {
			state.apr = action.payload;
		},
		setTotalSupply: (state, action: PayloadAction<number>) => {
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
