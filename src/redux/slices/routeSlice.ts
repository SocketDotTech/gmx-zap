import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IRouteSliceState {
	route: any;
}

const initialState: IRouteSliceState = {
	route: {},
};

export const routeSlice = createSlice({
	name: "route",
	initialState,
	reducers: {
		setRoute: (state, action: PayloadAction<any>) => {
			state.route = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setRoute } = routeSlice.actions;

export default routeSlice.reducer;
