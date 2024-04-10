'use client';

import React from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// public里存放折线图，柱状图，饼图的基本option.json文件
// store里配置一个chart/options页面所需的state,包括：图表名，图表类型（默认折线），配置（默认折线的），x data，series data

const ChartTags = () => {
	const handleChartTypeSelectChange = (value: string) => {
		console.log(value);
	};
	return (
		<div className="flex flex-col gap-2 px-4">
			<Select onValueChange={(value) => handleChartTypeSelectChange(value)}>
				<SelectTrigger className="w-[180px] font-mono">
					<SelectValue placeholder="Select x data" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="font-mono">data tags</SelectLabel>
						<SelectItem className="font-mono" value="line">
							Line
						</SelectItem>
						<SelectItem className="font-mono" value="bar">
							Bar
						</SelectItem>
						<SelectItem className="font-mono" value="pie">
							Pie
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select onValueChange={(value) => handleChartTypeSelectChange(value)}>
				<SelectTrigger className="w-[180px] font-mono">
					<SelectValue placeholder="Select y series" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="font-mono">data tags</SelectLabel>
						<SelectItem className="font-mono" value="line">
							Line
						</SelectItem>
						<SelectItem className="font-mono" value="bar">
							Bar
						</SelectItem>
						<SelectItem className="font-mono" value="pie">
							Pie
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default ChartTags;
