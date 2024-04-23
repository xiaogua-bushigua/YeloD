import { createSlice } from '@reduxjs/toolkit';
import { ICharts } from '@/lib/models';

export interface newICharts extends ICharts {
	checked: boolean;
}

interface IScreen {
	screenName: string;
	charts: Array<newICharts>;
	background: string;
}

const initialState: IScreen = {
	screenName: '',
	charts: [],
	background: 'light',
};

const screenSlice = createSlice({
	name: 'screen',
	initialState,
	reducers: {
		setBackground: (state, { payload }) => {
			state.background = payload;
		},
		initCharts(state, { payload }) {
			if(!state.charts.length) state.charts = payload;
		},
		setCheckedChart: (state, { payload }) => {
			const index = state.charts.findIndex((chart) => chart.chartName === payload);
			state.charts[index].checked = !state.charts[index].checked;
		},
	},
});

const screenReducer = screenSlice.reducer;

export default screenReducer;
export const { setBackground, setCheckedChart, initCharts } = screenSlice.actions;
