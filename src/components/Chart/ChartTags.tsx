'use client';

import { Checkbox } from '../ui/checkbox';
import { Button } from '@/components/ui/button';
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
import { setOptionData, setSelectedTags, resetOption } from '@/store/reducers/chartSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { IQuery } from '@/lib/models';

const ChartTags = () => {
	const { tags, selectedTags, chartType, updateMode, chartName } = useAppSelector((state: RootState) => state.chart);
	const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const [updateFlag, setUpdateFlag] = useState(false);

	const handleTagCheckedChange = async (value: string, checked: boolean) => {
		if (checked) {
			const queryId = tags.filter((tag) => tag.tag === value)[0]._id;
			dispatch(setSelectedTags({ xAxis: false, tag: value, queryId, type: 'checked' }));
		} else {
			dispatch(setSelectedTags({ tag: value, type: 'unchecked' }));
		}
		setUpdateFlag(false);
	};
	const handleXAxisTagSelected = (value: string) => {
		setSelectValue(value);
		dispatch(setSelectedTags({ xAxis: true, tag: value, type: 'xAxis' }));
		setUpdateFlag(false);
	};
	// 点击重置
	const handleClickReset = () => {
		setSelectValue(undefined);
		dispatch(resetOption());
		dispatch(setSelectedTags({ type: 'reset' }));
		setUpdateFlag(false);
	};
	// 整理请求data的query
	const getQueries = (): IQuery[] | undefined => {
		if (selectedTags.length < 2) {
			toast({
				title: 'Error',
				description: 'You should checked two tags at least.',
			});
			return;
		}
		const xAxisTag = selectedTags.filter((tag) => tag.xAxis);
		if (xAxisTag.length === 0 && (chartType === 'line' || chartType === 'bar')) {
			toast({
				title: 'Error',
				description: 'You should select one x axis tag.',
			});
			return;
		}
		let queries = [] as IQuery[];
		selectedTags.forEach((selectedTag) => {
			const index = tags.findIndex((tag) => tag.tag === selectedTag.tag);
			if (index > -1) queries.push(tags[index]);
		});
		// 如果有选中x轴，将选中的tag的query放在首位
		if (chartType === 'line' || chartType === 'bar') {
			const selectedQueryIndex = queries.findIndex((query) => query.tag === selectValue);
			const selectedQuery = queries[selectedQueryIndex];
			queries = queries.filter((query) => query.tag !== selectValue);
			queries.unshift(selectedQuery);
		}
		return queries;
	};
	// 点击填充数据
	const handleClickFill = async () => {
		const queries = getQueries();
		if (!queries) return;
		try {
			const promises = queries!.map(async (query) => {
				const res = await fetch('/api/dbTags', {
					method: 'POST',
					body: JSON.stringify(query),
				});
				const { data } = await res.json();
				return { data, tag: query.tag, queryId: query._id };
			});
			const info = await Promise.all(promises);
			dispatch(setOptionData(info));
			setUpdateFlag(true);
		} catch (error) {
			setUpdateFlag(false);
			console.error('Error clicking fill:', error);
		}
	};

	useEffect(() => {
		setSelectValue(
			selectedTags.filter((tag) => tag.xAxis)[0] ? selectedTags.filter((tag) => tag.xAxis)[0].tag : ''
		);
		if (chartName) setUpdateFlag(true);
	}, []);

	useEffect(() => {
		let eventSource: EventSource | undefined;
		const handleEventSourceMessage = (event: any) => {
			const { info } = JSON.parse(event.data);
			console.log('info', info);

			dispatch(setOptionData(info));
		};

		const handleEventSourceError = () => {
			if (eventSource) {
				eventSource.close();
			}
		};
		if (updateFlag && updateMode === 'dynamic' && selectedTags.length) {
			eventSource = new EventSource(`/api/events?params=${JSON.stringify(getQueries())}&interval=1000`);
			eventSource.addEventListener('message', handleEventSourceMessage);
			eventSource.onerror = handleEventSourceError;
		} else {
			if (eventSource) {
				eventSource.removeEventListener('message', handleEventSourceMessage);
				eventSource.close();
				eventSource = undefined;
			}
		}
		return () => {
			if (eventSource) {
				eventSource.removeEventListener('message', handleEventSourceMessage);
				eventSource.close();
			}
		};
	}, [updateMode, updateFlag]);

	return (
		<div className="p-6 h-full w-full overflow-y-scroll">
			<div className="flex">
				<span className="font-mono mr-4 font-bold text-slate-600">Tags: </span>
				<div className="flex flex-wrap gap-2">
					{tags.map(
						(tag) =>
							tag.tag && (
								<div key={tag.tag} className="checkboxItems flex items-center space-x-2 w-48">
									<Checkbox
										onCheckedChange={(checked: boolean) => handleTagCheckedChange(tag.tag, checked)}
										id={tag.tag}
										checked={
											selectedTags.findIndex((selectedTag) => selectedTag.tag === tag.tag) > -1
										}
									/>
									<label
										htmlFor={tag.tag}
										className="font-mono select-none cursor-pointer text-slate-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{tag.tag}
									</label>
								</div>
							)
					)}
				</div>
			</div>
			<div className={'w-full my-4'}>
				<div className="flex items-center">
					<span className="mr-4 font-bold text-slate-600 font-mono">x Axis Tag: </span>
					<Select
						key={'selected x axis tag'}
						value={selectValue}
						onValueChange={(value) => handleXAxisTagSelected(value)}
						disabled={chartType === 'pie'}
					>
						<SelectTrigger className="w-[180px] font-mono">
							<SelectValue placeholder="Select a tag" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel className="font-mono">data tags</SelectLabel>
								{selectedTags.map((tag) => (
									<SelectItem key={tag.tag + 'select'} className="font-mono" value={tag.tag}>
										{tag.tag}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="mt-4 w-1/2">
					<Button
						onClick={handleClickReset}
						variant="outline"
						className="font-mono w-1/3 mr-4 h-8 text-slate-700 hover:text-slate-50 bg-slate-50 hover:bg-slate-500 active:ring active:ring-slate-200 active:bg-slate-500"
					>
						Reset
					</Button>
					<Button
						variant="outline"
						onClick={handleClickFill}
						className="font-mono w-1/3 mr-4 h-8 text-slate-50 hover:text-slate-900 bg-slate-600 hover:bg-slate-50 active:ring active:ring-slate-200 active:bg-slate-100"
					>
						Fill
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChartTags;
