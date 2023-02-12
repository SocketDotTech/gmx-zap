import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IRouteSliceState {
	route: any;
	slippage: number;
}

const initialState: IRouteSliceState = {
	route: {},
	slippage: 1,
};

export const routeSlice = createSlice({
	name: "route",
	initialState,
	reducers: {
		setRoute: (state, action: PayloadAction<any>) => {
			state.route = action.payload;
		},
		setSlippage: (state, action: PayloadAction<number>) => {
			state.slippage = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setRoute, setSlippage } = routeSlice.actions;

export default routeSlice.reducer;
