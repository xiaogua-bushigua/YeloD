import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lineBasicOption from '@/assets/charts/line.json';
import BarBasicOption from '@/assets/charts/bar.json';
import PieBasicOption from '@/assets/charts/pie.json';

interface IinitialState {
	chartName: string;
	chartType: string;
	option: any;
	tempOption: string;
	optionData: Array<string[] | number[]>;
	tags: Array<{
		tag: string;
		field: string;
		query: string;
		uri: string;
		collectionName: string;
	}>;
	selectedTags: Array<{
		tag: string;
		queryIndex: number;
		xAxis: boolean;
	}>;
}

const initialState: IinitialState = {
	chartName: 'chart-name',
	chartType: 'line',
	option: lineBasicOption,
	tempOption: '',
	optionData: [lineBasicOption.xAxis[0].data, lineBasicOption.series[0].data],
	tags: [],
	selectedTags: [],
};

// 获取所有的tag标签和该标签对应的查询信息
export const fetchTagsInfo = createAsyncThunk('dbTags', async (username: string) => {
	const res = await fetch(`/api/dbQuery?username=${username}`, {
		method: 'GET',
	});
	return res.json();
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
			state.tempOption = '';
			state.optionData = [lineBasicOption.xAxis[0].data, lineBasicOption.series[0].data];
			state.tags = [];
			state.selectedTags = [];
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
		initChart(state, action) {
			state.chartName = action.payload.chartName;
			state.chartType = action.payload.chartType;
			state.option = action.payload.option;
			state.selectedTags = action.payload.selectedTags;
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
		setOptionData(state, action) {
			const data = action.payload.map((d: { data: Array<string[] | number[]>; tag: string }) => d.data);
			const tags = action.payload.map((d: { data: Array<string[] | number[]>; tag: string }) => d.tag);
			state.optionData = data;
			if (state.chartType === 'line' || state.chartType === 'bar') {
				state.option.xAxis[0].data = state.optionData[0];
				for (let i = 1; i < state.optionData.length; i++) {
					state.option.series[i - 1] = {
						data: state.optionData[i],
						type: state.chartType,
						name: tags[i],
						tagName: tags[i],
					};
				}
			} else if (state.chartType === 'pie') {
				state.option.series[0].data = state.optionData.map((data, index) => ({
					value: data.length,
					name: tags[index],
					tagName: tags[index],
				}));
			}
		},
		setTempOption(state, action) {
			state.tempOption = action.payload;
		},
		setOption(state, action) {
			state.option = action.payload;
		},
		setSelectedTags(state, action) {
			switch (action.payload.type) {
				case 'checked':
					state.selectedTags.push({
						tag: action.payload.tag,
						queryIndex: action.payload.queryIndex,
						xAxis: action.payload.xAxis,
					});
					break;
				case 'unchecked':
					state.selectedTags = state.selectedTags.filter((tag) => tag.tag !== action.payload.tag);
					break;
				case 'xAxis':
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
	setTempOption,
	setOption,
	setSelectedTags,
	initChart,
	resetOption,
} = chartSlice.actions;
