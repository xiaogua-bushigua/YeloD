"use client";

import ReactECharts from 'echarts-for-react';

const ChartView = () => {
  const option = {
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: [150, 230, 224, 218, 135, 147, 260],
				type: 'line',
			},
		],
  }; 
	return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default ChartView;
