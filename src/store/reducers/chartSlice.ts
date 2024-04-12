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
		data: number[] | string[];
	}>;
}

const initialState: IinitialState = {
	chartName: 'line-chart',
	chartType: 'line',
	option: lineBasicOption,
	xData: lineBasicOption.xAxis.data,
	seriesData: [lineBasicOption.series[0].data],
	tags: [
		{
			tag: 'default-xData',
			data: lineBasicOption.xAxis.data,
		},
		{
			tag: 'default-seriesData',
			data: lineBasicOption.series[0].data,
		},
	],
};

export const fetchTagsInfo = createAsyncThunk('dbTags', async (username: string) => {
	const res = await fetch(`/api/dbTags?username=${username}`, {
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
			state.tags = [
				{
					tag: 'default-xData',
					data: lineBasicOption.xAxis.data,
				},
				{
					tag: 'default-seriesData',
					data: lineBasicOption.series[0].data,
				},
			];
		},
		changeChartType(state, action) {
			state.chartType = action.payload;
		},
		changeChartName(state, action) {
			state.chartName = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchTagsInfo.fulfilled, (state, action) => {
			state.tags = action.payload.data;
		});
	},
});

const chartReducer = chartSlice.reducer;

export default chartReducer;
export const { changeChartType, changeChartName, resetChart } = chartSlice.actions;
