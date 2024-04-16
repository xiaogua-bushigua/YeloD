'use client';

import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';

const ChartView = ({ option }: { option: any }) => (
	<ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
);

export default ChartView;
