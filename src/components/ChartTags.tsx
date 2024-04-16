'use client';

import React, { useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { setXData, setSeries } from '@/store/reducers/chartSlice';
import { useAppDispatch } from '@/store/hooks';

const ChartTags = () => {
	const { tags } = useAppSelector((state: RootState) => state.chart);
	const dispatch = useAppDispatch();
	const handleChartTypeSelectChange = async (value: string, type: string) => {
		const query = tags.filter((tag) => tag.tag === value)[0];
		const res = await fetch('/api/dbTags', {
			method: 'POST',
			body: JSON.stringify(query),
		});
		const { data } = await res.json();
		if (type === 'xData') {
			dispatch(setXData(data));
		} else {
			dispatch(setSeries({ data, index: 0 }));
		}
	};
	return (
		<div className="flex flex-col gap-2 px-4">
			<Select onValueChange={(value) => handleChartTypeSelectChange(value, 'xData')}>
				<SelectTrigger className="w-[180px] font-mono">
					<SelectValue placeholder="Select x data" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="font-mono">data tags</SelectLabel>
						{tags.map((tag) => (
							<SelectItem key={tag.tag + '_x'} className="font-mono" value={tag.tag}>
								{tag.tag}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select onValueChange={(value) => handleChartTypeSelectChange(value, 'series')}>
				<SelectTrigger className="w-[180px] font-mono">
					<SelectValue placeholder="Select y series" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="font-mono">data tags</SelectLabel>
						{tags.map((tag) => (
							<SelectItem key={tag.tag + '_y'} className="font-mono" value={tag.tag}>
								{tag.tag}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default ChartTags;
