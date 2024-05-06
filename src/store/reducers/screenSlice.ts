import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ICharts, IChartsInfo } from '@/lib/models';

export interface newICharts extends ICharts {
	checked: boolean;
	left: string;
	top: string;
	width: string;
	height: string;
}

export interface IScreen {
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
		// 当点击已有的screen卡片时，初始化该screen的states
		initScreen: (state, { payload }) => {
			state.background = payload.background;
			state.title = payload.title;
			state.ratio = payload.ratio;
			state.fullScreen = false;
			state.staticInterval = parseInt(payload.staticInterval);
			state.dynamicInterval = parseInt(payload.dynamicInterval);
			state.screenName = payload.screenName;
			state.charts = payload.charts;
		},
		// 当点击新建screen卡片时，初始化该screen的states
		resetScreen: (state) => {
			state.screenName = '';
			state.charts = [];
			state.background = 'light';
			state.title = 'Dashboard';
			state.ratio = '1:1';
			state.fullScreen = false;
			state.staticInterval = 5;
			state.dynamicInterval = 5;
		},
		// 点击新建screen卡片时，初始化states里的charts
		initCharts(state, { payload }) {
			if (!state.charts.length) state.charts = payload;
		},
		setBackground: (state, { payload }) => {
			state.background = payload;
		},
		setCheckedChart: (state, { payload }) => {
			const index = state.charts.findIndex((chart) => chart.chartName === payload);
			state.charts[index].checked = !state.charts[index].checked;
		},
		setTitle: (state, { payload }) => {
			state.title = payload;
		},
		setScreenName: (state, { payload }) => {
			state.screenName = payload;
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
		setGeometry: (state, { payload }) => {
			const index = state.charts.findIndex((chart) => chart._id === payload.id);
			switch (payload.type) {
				case 'left':
					state.charts[index].left = payload.value;
					break;
				case 'top':
					state.charts[index].top = payload.value;
					break;
				case 'width':
					state.charts[index].width = payload.value;
					break;
				case 'height':
					state.charts[index].height = payload.value;
					break;
				default:
					break;
			}
		},
	},
  // 根据查询语句更新screen上所有图表option的data
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
	initScreen,
	setGeometry,
	setScreenName,
	resetScreen,
} = screenSlice.actions;
