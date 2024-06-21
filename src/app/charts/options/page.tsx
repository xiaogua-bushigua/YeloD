'use client';

import ChartOperations from '@/components/Chart/ChartOperations';
import ChartTags from '@/components/Chart/ChartTags';
import ChartView from '@/components/Chart/ChartView';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { fetchTagsInfo } from '@/store/reducers/chartSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const Page = () => {
	const { chartName, chartType, updateMode } = useAppSelector((state: RootState) => state.chart);
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
	useEffect(() => {
		// 获取所有的tag标签和该标签对应的查询信息
		dispatchAsync(fetchTagsInfo(user.name || user.username));
	}, []);
	return (
		<div className="w-full h-full overflow-hidden pt-2">
			<ChartOperations chartName={chartName} chartType={chartType} updateMode={updateMode} />
			<div className="flex gap-4 w-full mt-2 h-[calc(100vh-144px)]">
				<div className="w-4/6 bg-white rounded-lg shadow-md">
					<div className="w-full h-full py-8">
						<ChartView />
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-md w-2/6">
					<ChartTags />
				</div>
			</div>
		</div>
	);
};

export default Page;
