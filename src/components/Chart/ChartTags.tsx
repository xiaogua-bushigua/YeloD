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
import { setOptionData, setSelectedTags } from '@/store/reducers/chartSlice';
import { useAppDispatch } from '@/store/hooks';

const ChartTags = () => {
	const { tags, selectedTags, optionData } = useAppSelector((state: RootState) => state.chart);
	const dispatch = useAppDispatch();

	const handleChartTagSelectChange = async (value: string, index: number) => {
		const query = tags.filter((tag) => tag.tag === value)[0];
		const queryIndex = tags.findIndex((tag) => tag.tag === value);
		const res = await fetch('/api/dbTags', {
			method: 'POST',
			body: JSON.stringify(query),
		});
		const { data } = await res.json();
		dispatch(setOptionData({data, index}));
		dispatch(setSelectedTags({ index, tag: value, queryIndex }));
	};
	return (
		<div className="flex gap-4 px-4 flex-wrap">
			{optionData.map((data, index) => (
				<Select
					key={'selected data' + index}
					value={selectedTags[index].tag}
					onValueChange={(value) => handleChartTagSelectChange(value, index)}
				>
					<SelectTrigger className="w-[180px] font-mono">
						<SelectValue placeholder="Select a tag" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel className="font-mono">data tags</SelectLabel>
							<SelectItem className="font-mono" value={'default'}>
								Default
							</SelectItem>
							{tags.map((tag) => (
								<SelectItem key={tag.tag + index} className="font-mono" value={tag.tag}>
									{tag.tag}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			))}
		</div>
	);
};

export default ChartTags;
