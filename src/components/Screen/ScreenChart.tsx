import ReactECharts from 'echarts-for-react';
import { newICharts } from '@/store/reducers/screenSlice';

const ScreenChart = ({ chart }: { chart: newICharts }) => {
  console.log(chart);
	return <ReactECharts option={chart.option} style={{ height: '100%', width: '100%' }} />;
};

export default ScreenChart
