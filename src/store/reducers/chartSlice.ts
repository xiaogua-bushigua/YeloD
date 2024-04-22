import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lineBasicOption from '@/assets/charts/line.json';
import BarBasicOption from '@/assets/charts/bar.json';
import PieBasicOption from '@/assets/charts/pie.json';

interface IinitialState {
	chartName: string;
	chartType: string;
	option: any;
	tempOption: string;
	xData: string[] | number[];
	seriesData: Array<string[] | number[]>;
	tags: Array<{
		tag: string;
		field: string;
		query: string;
		uri: string;
		collectionName: string;
	}>;
	selectedTags: string[];
}

const initialState: IinitialState = {
	chartName: 'chart-name',
	chartType: 'line',
	option: lineBasicOption,
	tempOption: '',
	xData: lineBasicOption.xAxis.data,
	seriesData: [lineBasicOption.series[0].data],
	tags: [],
	selectedTags: [],
};

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
		resetChart(state) {
			state.chartName = 'chart-name';
			state.chartType = 'line';
			state.option = lineBasicOption;
			state.tempOption = '';
			state.xData = lineBasicOption.xAxis.data;
			state.seriesData = [lineBasicOption.series[0].data];
			state.tags = [];
			state.selectedTags = [];
		},
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
		},
		changeChartName(state, action) {
			state.chartName = action.payload;
		},
		setXData(state, action) {
			state.xData = action.payload;
			state.option.xAxis.data = state.xData;
		},
		setSeries(state, action) {
			const index = action.payload.index;
			state.seriesData[index] = action.payload.data;
			state.option.series[index].data = state.seriesData[index];
		},
		setTempOption(state, action) {
			state.tempOption = action.payload;
		},
		setOption(state, action) {
			state.option = action.payload;
		},
		setSelectedTags(state, action) {
			state.selectedTags[action.payload.index] = action.payload.name;
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
	setXData,
	setSeries,
	setTempOption,
	setOption,
	setSelectedTags,
	initChart,
} = chartSlice.actions;
