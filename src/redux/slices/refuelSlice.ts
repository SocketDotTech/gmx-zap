import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IRefuelSliceState {
	enabledRefuel: boolean;
	fromAmount: string;
	toAmount: string;
	refuelDetail: any;
}

const initialState: IRefuelSliceState = {
	enabledRefuel: false,
	fromAmount: "",
	toAmount: "",
	refuelDetail: {},
};

export const refuelSlice = createSlice({
	name: "refuel",
	initialState,
	reducers: {
		setRefuelReset: (state) => {
			return initialState; // INSTEAD OF THIS state = initialState;
		},
		setEnabledRefuel: (state, action: PayloadAction<boolean>) => {
			state.enabledRefuel = action.payload;
		},
		setRefuelFromAmount: (state, action: PayloadAction<string>) => {
			state.fromAmount = action.payload;
		},
		setRefuelToAmount: (state, action: PayloadAction<string>) => {
			state.toAmount = action.payload;
		},
		setRefuelDetail: (state, action: PayloadAction<any>) => {
			state.refuelDetail = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setRefuelReset,
	setEnabledRefuel,
	setRefuelFromAmount,
	setRefuelToAmount,
	setRefuelDetail,
} = refuelSlice.actions;

export default refuelSlice.reducer;
