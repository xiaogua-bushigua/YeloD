"use client";

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const ChartOptions = () => {
	const options = {
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
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<pre className="my-0 shadow-md border-2 border-t-slate-200 border-indigo-50 rounded-lg h-full">
			<code className="language-js">{JSON.stringify(options, null, 2)}</code>
		</pre>
	);
};

export default ChartOptions;
