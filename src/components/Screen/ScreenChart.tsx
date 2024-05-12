import ReactECharts from 'echarts-for-react';
import { newICharts } from '@/store/reducers/screenSlice';
import { forwardRef, Ref } from 'react';
import EChartsReact from 'echarts-for-react';

interface Props {
	chart: newICharts;
}

const ScreenChart = forwardRef((props: Props, ref: Ref<EChartsReact>) => {
	return <ReactECharts ref={ref} option={props.chart.option} style={{ height: '100%', width: '100%' }} />;
});

export default ScreenChart;
