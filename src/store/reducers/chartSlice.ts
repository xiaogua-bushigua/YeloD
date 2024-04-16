import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lineBasicOption from '@/assets/charts/line.json';
import BarBasicOption from '@/assets/charts/bar.json';
import PieBasicOption from '@/assets/charts/pie.json';

interface IinitialState {
	chartName: string;
	chartType: string;
	option: any;
	xData: string[] | number[];
	seriesData: Array<string[] | number[]>;
	tags: Array<{
		tag: string;
		field: string;
		query: string;
		uri: string;
		collectionName: string;
	}>;
}

const initialState: IinitialState = {
	chartName: 'line-chart',
	chartType: 'line',
	option: lineBasicOption,
	xData: lineBasicOption.xAxis.data,
	seriesData: [lineBasicOption.series[0].data],
	tags: [],
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
			state.chartName = 'line-chart';
			state.chartType = 'line';
			state.option = lineBasicOption;
			state.xData = lineBasicOption.xAxis.data;
			state.seriesData = [lineBasicOption.series[0].data];
			state.tags = [];
		},
		changeChartType(state, action) {
			state.chartType = action.payload;
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
	},
	extraReducers(builder) {
		builder.addCase(fetchTagsInfo.fulfilled, (state, action) => {
			state.tags = action.payload.queries.queries;
		});
	},
});

const chartReducer = chartSlice.reducer;

export default chartReducer;
export const { changeChartType, changeChartName, resetChart, setXData, setSeries } = chartSlice.actions;
