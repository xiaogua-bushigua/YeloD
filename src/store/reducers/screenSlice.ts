import { createSlice } from '@reduxjs/toolkit';

interface IScreen {
}

const initialState: IScreen = {
};

const screenSlice = createSlice({
	name: 'screen',
	initialState,
	reducers: {
		setScreenRef: (state, { payload }) => {
      // state.screenRef = payload;
		},
	},
});

const screenReducer = screenSlice.reducer;

export default screenReducer;
export const { setScreenRef } = screenSlice.actions;
