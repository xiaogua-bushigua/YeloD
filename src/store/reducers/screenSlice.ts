import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
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
			state.charts = payload;
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
		// 局部刷新更新的option data
		localRefreshOptionData: (state, { payload }) => {
			state.charts.forEach((chart: newICharts) => {
				const chartIndex = payload.findIndex((p: newICharts) => p._id === chart._id);
				if (chartIndex > -1) chart.option = payload[chartIndex].option;
			});
		},
		changeChartOption: (state, { payload }) => {
			const index = state.charts.findIndex((chart) => chart._id === payload.id);
			switch (payload.type) {
				case 'padding':
					if (payload.prop === 'radius') {
						state.charts[index].option.series[0].radius = payload.value;
					} else {
						const grid = state.charts[index].option.grid ? state.charts[index].option.grid : {};
						grid[0][payload.prop] = payload.value;
						state.charts[index].option.grid = grid;
					}
					break;
				case 'label':
					const label = state.charts[index].option.series[0].label || {};
					state.charts[index].option.series.forEach((s: any) => {
						s.label = {
							show: payload.prop === 'show' ? payload.value : label.show || false,
							position: payload.prop === 'position' ? payload.value : label.position || 'top',
							color: payload.prop === 'color' ? payload.value : label.color || '#666',
							fontSize: payload.prop === 'fontSize' ? payload.value : label.fontSize || 12,
						};
					});
					break;
				case 'title':
					let title = state.charts[index].option.title || {};
					state.charts[index].option.title = {
						left: 'center',
						show: payload.prop === 'show' ? payload.value : title.show || false,
						text: payload.prop === 'text' ? payload.value : title.text || '',
						textStyle: {
							color:
								payload.prop === 'color'
									? payload.value
									: title.textStyle
									? title.textStyle.color
									: '#777',
							fontSize:
								payload.prop === 'fontSize'
									? payload.value
									: title.textStyle
									? title.textStyle.fontSize
									: 18,
						},
					};
					break;
				case 'axis':
					let axisLabel = state.charts[index].option.xAxis[0].axisLabel || {};
					state.charts[index].option.xAxis[0].axisLabel = {
						color: payload.prop === 'color' ? payload.value : axisLabel.color || '#333',
						fontSize: payload.prop === 'fontSize' ? payload.value : axisLabel.fontSize || 12,
					};
					state.charts[index].option.yAxis[0].axisLabel = {
						color: payload.prop === 'color' ? payload.value : axisLabel.color || '#333',
						fontSize: payload.prop === 'fontSize' ? payload.value : axisLabel.fontSize || 12,
					};
					break;
				case 'legend':
					let legend = state.charts[index].option.legend || {};
					state.charts[index].option.legend = {
						orient: payload.prop === 'orient' ? payload.value : legend.orient || 'vertical',
						left: payload.prop === 'left' ? payload.value : legend.left || 10,
						top: payload.prop === 'top' ? payload.value : legend.top || 0,
						textStyle: {
							color:
								payload.prop === 'color'
									? payload.value
									: legend.textStyle
									? legend.textStyle.color
									: '#333',
							fontSize:
								payload.prop === 'fontSize'
									? payload.value
									: legend.textStyle
									? legend.textStyle.fontSize
									: 12,
						},
					};
					break;
				case 'series':
					let series = state.charts[index].option.series || {};
					switch (payload.chartType) {
						case 'pie':
							state.charts[index].option.series[0].data[payload.index] = {
								...series[0].data[payload.index],
								name: payload.prop === 'name' ? payload.value : series[0].data[payload.index].name,
								itemStyle: {
									color:
										payload.prop === 'color'
											? payload.value
											: series[payload.index].itemStyle
											? series[payload.index].itemStyle.color
											: '#44ff44',
								},
							};
							break;
						case 'bar':
							state.charts[index].option.series[payload.index] = {
								...series[payload.index],
								name: payload.prop === 'name' ? payload.value : series.name,
								itemStyle: {
									color:
										payload.prop === 'color'
											? payload.value
											: series[payload.index].itemStyle
											? series[payload.index].itemStyle.color
											: '#44ff44',
								},
							};
							break;
						case 'line':
							state.charts[index].option.series[payload.index] = {
								...series[payload.index],
								name: payload.prop === 'name' ? payload.value : series.name,
								lineStyle: {
									color:
										payload.prop === 'color'
											? payload.value
											: series[payload.index].lineStyle
											? series[payload.index].lineStyle.color
											: '#44ff44',
								},
								itemStyle: {
									color:
										payload.prop === 'color'
											? payload.value
											: series[payload.index].itemStyle
											? series[payload.index].itemStyle.color
											: '#44ff44',
								},
							};
							break;
						default:
							break;
					}
				default:
					break;
			}
		},
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
	localRefreshOptionData,
	resetScreen,
	changeChartOption,
} = screenSlice.actions;
