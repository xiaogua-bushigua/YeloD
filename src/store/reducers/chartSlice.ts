import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lineBasicOption from '@/assets/charts/line.json';
import BarBasicOption from '@/assets/charts/bar.json';
import PieBasicOption from '@/assets/charts/pie.json';

interface IinitialState {
	chartName: string;
	chartType: string;
	updateMode: string;
	option: any;
	optionData: Array<string[] | number[]>;
	tags: Array<{
		tag: string;
		field: string;
		query: string;
		uri: string;
		collectionName: string;
		_id: string;
		method: string;
	}>;
	selectedTags: Array<{
		tag: string;
		queryId: string;
		xAxis: boolean;
	}>;
}

const initialState: IinitialState = {
	chartName: 'chart-name',
	chartType: 'line',
	updateMode: 'static',
	option: lineBasicOption,
	optionData: [lineBasicOption.xAxis[0].data, lineBasicOption.series[0].data],
	tags: [],
	selectedTags: [],
};

// 获取所有的tag标签和该标签对应的查询信息
export const fetchTagsInfo = createAsyncThunk('dbTags', async (username: string) => {
	try {
		const res = await fetch(`/api/dbQuery?username=${username}`, {
			method: 'GET',
		});
		return res.json();
	} catch (error) {
		console.log('Error fetching tags info:', error);
		return {
			queries: {
				queries: [],
			},
		};
	}
});

const chartSlice = createSlice({
	name: 'chart',
	initialState,
	reducers: {
		// 点击新建卡片时，重置所有状态
		resetChart(state) {
			state.chartName = 'chart-name';
			state.chartType = 'line';
			state.option = lineBasicOption;
			state.optionData = [lineBasicOption.xAxis[0].data, lineBasicOption.series[0].data];
			state.tags = [];
			state.selectedTags = [];
			state.updateMode = 'static';
		},
		// 在option页面点击reset时，仅仅重置option
		resetOption(state) {
			switch (state.chartType) {
				case 'line':
					state.option = lineBasicOption;
					break;
				case 'pie':
					state.option = PieBasicOption;
					break;
				case 'bar':
					state.option = BarBasicOption;
				default:
					break;
			}
		},
		// 点击图表卡片时，把图表的信息储存在状态里，以便于带到下一个页面
		initChart(state, { payload }) {
			state.chartName = payload.chartName;
			state.chartType = payload.chartType;
			state.option = payload.option;
			state.selectedTags = payload.selectedTags;
			state.updateMode = payload.updateMode;
		},
		changeChartType(state, action) {
			state.chartType = action.payload;
			switch (action.payload) {
				case 'line':
					state.option = lineBasicOption;
					break;
				case 'pie':
					state.option = PieBasicOption;
					break;
				case 'bar':
					state.option = BarBasicOption;
					break;
				default:
					break;
			}
			state.selectedTags = [];
			state.optionData = [];
		},
		changeChartName(state, action) {
			state.chartName = action.payload;
		},
		changeUpdateMode(state, action) {
			state.updateMode = action.payload;
		},
		setOptionData(state, { payload }) {
			const data = payload.map((d: { data: Array<string[] | number[]>; tag: string; queryId: string }) => d.data);
			const tags = payload.map((d: { data: Array<string[] | number[]>; tag: string; queryId: string }) => d.tag);
			state.optionData = data;
			if (state.chartType === 'line' || state.chartType === 'bar') {
				state.option.xAxis[0].data = state.optionData[0];
				state.option.xAxis[0].queryId = payload[0].queryId;
				for (let i = 1; i < state.optionData.length; i++) {
					state.option.series[i - 1] = {
						data: state.optionData[i],
						type: state.chartType,
						name: tags[i],
						tagName: tags[i],
						queryId: payload[i].queryId,
					};
				}
			} else if (state.chartType === 'pie') {
				state.option.series[0].data = state.optionData.map((data, index) => ({
					value: data[0],
					name: tags[index],
					tagName: tags[index],
					queryId: payload[index].queryId,
				}));
			}
		},
		setOption(state, action) {
			state.option = action.payload;
		},
		setSelectedTags(state, action) {
			switch (action.payload.type) {
				case 'checked':
					state.selectedTags.push({
						tag: action.payload.tag,
						queryId: action.payload.queryId,
						xAxis: action.payload.xAxis,
					});
					break;
				case 'unchecked':
					state.selectedTags = state.selectedTags.filter((tag) => tag.tag !== action.payload.tag);
					break;
				case 'xAxis':
					state.selectedTags.forEach((tag) => {
						tag.xAxis = false;
					});
					state.selectedTags.forEach((tag) => {
						if (tag.tag === action.payload.tag) tag.xAxis = true;
					});
					break;
				case 'reset':
					state.selectedTags = [];
				default:
					break;
			}
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchTagsInfo.fulfilled, (state, action) => {
			state.tags = action.payload.queries.queries;
		});
	},
});

const chartReducer = chartSlice.reducer;

export default chartReducer;
export const {
	changeChartType,
	changeChartName,
	resetChart,
	setOptionData,
	setOption,
	setSelectedTags,
	initChart,
	resetOption,
	changeUpdateMode,
} = chartSlice.actions;
