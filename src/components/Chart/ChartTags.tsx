'use client';

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
import { setXData, setSeries, setSelectedTags } from '@/store/reducers/chartSlice';
import { useAppDispatch } from '@/store/hooks';

const ChartTags = () => {
	const { tags, selectedTags } = useAppSelector((state: RootState) => state.chart);
	const dispatch = useAppDispatch();

	const handleChartTagSelectChange = async (value: string, type: string) => {
		const query = tags.filter((tag) => tag.tag === value)[0];
		const queryIndex = tags.findIndex((tag) => tag.tag === value);
		const res = await fetch('/api/dbTags', {
			method: 'POST',
			body: JSON.stringify(query),
		});
		const { data } = await res.json();
		if (type === 'xData') {
			dispatch(setXData(data));
			dispatch(setSelectedTags({ index: 0, tag: value, queryIndex }));
		} else {
			dispatch(setSeries({ data, index: 0 }));
			dispatch(setSelectedTags({ index: 1, tag: value, queryIndex }));
		}
	};
	return (
		<div className="flex flex-col gap-2 px-4">
			<Select
				value={selectedTags[0] ? selectedTags[0].tag : ''}
				onValueChange={(value) => handleChartTagSelectChange(value, 'xData')}
			>
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
			<Select
				value={selectedTags[1] ? selectedTags[1].tag : ''}
				onValueChange={(value) => handleChartTagSelectChange(value, 'series')}
			>
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
