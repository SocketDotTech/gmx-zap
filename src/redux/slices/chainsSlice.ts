import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChainDetail, ChainsDetailObj } from "../../types";
import { swapChainsCompatible } from "../../helpers";

export interface IChainsSliceState {
	chainsInfo: ChainsDetailObj;
	inputChainsList: Array<ChainDetail>;
	outputChainsList: Array<ChainDetail>;
	inputChainId: number;
	outputChainId: number;
}

const initialState: IChainsSliceState = {
	chainsInfo: {},
	inputChainId: 0,
	outputChainId: 0,
	inputChainsList: [],
	outputChainsList: [],
};

export const chainsSlice = createSlice({
	name: "chains",
	initialState,
	reducers: {
		setChainsInfo: (state, action: PayloadAction<ChainsDetailObj>) => {
			state.chainsInfo = action.payload;
		},
		setInputChainsList: (
			state,
			action: PayloadAction<Array<ChainDetail>>
		) => {
			state.inputChainsList = action.payload;
		},
		setOutputChainsList: (
			state,
			action: PayloadAction<Array<ChainDetail>>
		) => {
			state.outputChainsList = action.payload;
		},
		setInputChainId: (state, action: PayloadAction<number>) => {
			const oldInputChainId = state.inputChainId,
				newInputChainId = action.payload,
				outputChainId = state.outputChainId;
			if (outputChainId === newInputChainId) {
				if (swapChainsCompatible(newInputChainId, oldInputChainId)) {
					state.outputChainId = oldInputChainId;
				} else {
					if (state.outputChainsList[0]?.chainId === outputChainId)
						state.outputChainId =
							state.outputChainsList[1]?.chainId;
					else
						state.outputChainId =
							state.outputChainsList[0]?.chainId;
				}
			}
			state.inputChainId = newInputChainId;
		},
		setOutputChainId: (state, action: PayloadAction<number>) => {
			const oldOutputChainId = state.outputChainId,
				newOutputChainId = action.payload,
				inputChainId = state.inputChainId;
			if (
				inputChainId === newOutputChainId &&
				swapChainsCompatible(oldOutputChainId, newOutputChainId)
			) {
				state.outputChainId = newOutputChainId;
				state.inputChainId = oldOutputChainId;
			} else state.outputChainId = newOutputChainId;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setChainsInfo,
	setInputChainsList,
	setOutputChainsList,
	setInputChainId,
	setOutputChainId,
} = chainsSlice.actions;

export default chainsSlice.reducer;
