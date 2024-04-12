'use client';

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const ChartOptions = ({ option }: { option: any }) => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<pre className="my-0 shadow-md border-2 border-t-slate-200 border-indigo-50 rounded-lg h-full">
			<code className="language-js">{JSON.stringify(option, null, 2)}</code>
		</pre>
	);
};

export default ChartOptions;
