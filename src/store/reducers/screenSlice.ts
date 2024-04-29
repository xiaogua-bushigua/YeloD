import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
	staticInterval: number;
	dynamicInterval: number;
}

const initialState: IScreen = {
	screenName: '',
	charts: [],
	background: 'light',
	title: 'Dashboard',
	ratio: '1:1',
	fullScreen: false,
	staticInterval: 5,
	dynamicInterval: 5,
};

export const fetchOptionData = createAsyncThunk(
	'screenChartQuery',
	async ({ username, queryIndexes }: { username: string; queryIndexes: number[] }) => {
		const res = await fetch('/api/chart', {
			method: 'POST',
			body: JSON.stringify({ username, queryIndexes }),
		});
		return res.json();
	}
);

const screenSlice = createSlice({
	name: 'screen',
	initialState,
	reducers: {
		initStateFunction: (state) => {
			state.background = 'light';
			state.title = 'Dashboard';
			state.ratio = '1:1';
			state.fullScreen = false;
			state.staticInterval = 5;
			state.dynamicInterval = 5;
			state.charts = [];
			state.screenName = '';
		},
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
		setRefreshInterval: (state, { payload }) => {
			if (payload.type === 'static') {
				state.staticInterval = payload.interval;
			} else {
				state.dynamicInterval = payload.interval;
			}
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchOptionData.fulfilled, (state, action) => {
			const res = action.payload.data;
			state.charts.forEach((chart) => {
				chart.selectedTags.forEach((tag, index) => {
					const position = res.findIndex((item: any) => item.queryIndex === tag.queryIndex);
					if (position !== -1) {
						if (index === 0) chart.option.xAxis.data = res[position].data;
						else chart.option.series[0].data = res[position].data;
					}
				});
			});
		});
	},
});

const screenReducer = screenSlice.reducer;

export default screenReducer;
export const {
	setBackground,
	setCheckedChart,
	initCharts,
	setTitle,
	setRatio,
	setFullScreen,
	setRefreshInterval,
	initStateFunction,
} = screenSlice.actions;
