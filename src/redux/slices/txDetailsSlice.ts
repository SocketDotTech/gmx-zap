import { createSlice } from "@reduxjs/toolkit";

export interface ITxDetailsSliceState {
	txDetails: any;
}

const initialState: ITxDetailsSliceState = {
	txDetails: JSON.parse(localStorage.getItem("txData") || "{}"),
};

const txDetailsSlice = createSlice({
	name: "txData",
	initialState,
	reducers: {
		setTxDetails: (state, action) => {
			Object.assign(state.txDetails, action.payload.prevTxDetails);
		},
	},
});

export default txDetailsSlice.reducer;
export const { setTxDetails } = txDetailsSlice.actions;
