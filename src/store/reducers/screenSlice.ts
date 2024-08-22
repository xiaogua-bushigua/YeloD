import { createSlice } from '@reduxjs/toolkit';
import { ICharts } from '@/lib/models';

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
	drawCloseFlag: boolean;
}

const initialState: IScreen = {
	screenName: '',
	charts: [],
	background: 'light',
	title: 'Dashboard',
	ratio: '1:1',
	fullScreen: false,
	staticInterval: 5,
	dynamicInterval: 1,
	drawCloseFlag: true,
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
			// state.charts = [];
			state.background = 'light';
			state.title = 'Dashboard';
			state.ratio = '1:1';
			state.fullScreen = false;
			state.staticInterval = 5;
			state.dynamicInterval = 1;
		},
		// 点击新建screen卡片时，初始化states里的charts
		initCharts(state, { payload }) {
			state.charts = payload.charts;
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
		// 静态更新option data
		staticRefreshOptionData: (state, { payload }) => {
			state.charts.forEach((chart: newICharts) => {
				if (chart._id === payload.data._id) chart.option = payload.data.option;
			});
		},
		// 动态更新option data
		dynamicRefreshOptionData: (state, { payload }) => {
			state.charts.forEach((chart: newICharts) => {
				if (chart.checked && chart.updateMode === 'dynamic') {
					if (chart.chartType === 'line' || chart.chartType === 'bar') {
						const xData = payload.filter(
							(item: { data: any[]; tag: string; queryId: string }) =>
								item.queryId === chart.option.xAxis[0].queryId
						);
						if (xData.length) chart.option.xAxis[0].data = xData[0].data;

						chart.option.series.forEach((se: any) => {
							const data = payload.filter(
								(item: { data: any[]; tag: string; queryId: string }) => item.queryId === se.queryId
							);
							if (data.length) se.data = data[0].data;
						});
					} else if (chart.chartType === 'pie') {
						chart.option.series[0].data.forEach((se: any) => {
							se.value = payload.filter(
								(item: { data: any[]; tag: string; queryId: string }) => item.queryId === se.queryId
							)[0].data[0];
						});
					}
				}
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
					let title = state.charts[index].option.title[0] || {};
					state.charts[index].option.title[0] = {
						left: 'center',
						show: true,
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
					let legend = state.charts[index].option.legend[0] || {};
					state.charts[index].option.legend[0] = {
						orient: payload.prop === 'orient' ? payload.value : legend.orient || 'horizontal',
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
					switch (payload.chartType) {
						case 'pie':
							let series = state.charts[index].option.series[0] || {};
							state.charts[index].option.series[0].data[payload.index] = {
								...series.data[payload.index],
								name: payload.prop === 'name' ? payload.value : series.data[payload.index].name,
								itemStyle: {
									color:
										payload.prop === 'color'
											? payload.value
											: series.data[payload.index].itemStyle
											? series.data[payload.index].itemStyle.color
											: '#44ff44',
								},
							};
							break;
						case 'bar':
							let series1 = state.charts[index].option.series || [];
							state.charts[index].option.series[payload.index] = {
								...series1[payload.index],
								name: payload.prop === 'name' ? payload.value : payload.defaultName,
								itemStyle: {
									color: payload.prop === 'color' ? payload.value : payload.defaultColor,
								},
							};
							break;
						case 'line':
							let series2 = state.charts[index].option.series || [];
							state.charts[index].option.series[payload.index] = {
								...series2[payload.index],
								name: payload.prop === 'name' ? payload.value : payload.defaultName,
								lineStyle: {
									color: payload.prop === 'color' ? payload.value : payload.defaultColor,
								},
								itemStyle: {
									color: payload.prop === 'color' ? payload.value : payload.defaultColor,
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
		setDrawCloseFlag: (state) => {
			state.drawCloseFlag = !state.drawCloseFlag;
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
	staticRefreshOptionData,
	dynamicRefreshOptionData,
	resetScreen,
	changeChartOption,
	setDrawCloseFlag,
} = screenSlice.actions;
