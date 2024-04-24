import { createSlice } from '@reduxjs/toolkit';
import { ICharts } from '@/lib/models';

export interface newICharts extends ICharts {
	checked: boolean;
}

interface IScreen {
	screenName: string;
	charts: Array<newICharts>;
	background: string;
	title: string;
	ratio: string;
	fullScreen: boolean;
}

const initialState: IScreen = {
	screenName: '',
	charts: [],
	background: 'light',
	title: '123',
	ratio: '1:1',
	fullScreen: false,
};

const screenSlice = createSlice({
	name: 'screen',
	initialState,
	reducers: {
		setBackground: (state, { payload }) => {
			state.background = payload;
		},
		initCharts(state, { payload }) {
			if (!state.charts.length) state.charts = payload;
		},
		setCheckedChart: (state, { payload }) => {
			const index = state.charts.findIndex((chart) => chart.chartName === payload);
			state.charts[index].checked = !state.charts[index].checked;
		},
		setTitle: (state, { payload }) => {
			state.title = payload;
		},
		setRatio: (state, { payload }) => {
			state.ratio = payload;
		},
		setFullScreen: (state, { payload }) => {
			state.fullScreen = payload;
		},
	},
});

const screenReducer = screenSlice.reducer;

export default screenReducer;
export const { setBackground, setCheckedChart, initCharts, setTitle, setRatio, setFullScreen } = screenSlice.actions;
