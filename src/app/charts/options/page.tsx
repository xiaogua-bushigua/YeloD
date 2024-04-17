'use client';

import ChartOperations from '@/components/ChartOperations';
import ChartTags from '@/components/ChartTags';
import ChartView from '@/components/ChartView';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { fetchTagsInfo } from '@/store/reducers/chartSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';

const ChartOptions = dynamic(() => import('@/components/ChartOptions'), { ssr: false });

const page = () => {
	const { option, chartName, chartType } = useAppSelector((state: RootState) => state.chart);
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
	useEffect(() => {
		dispatchAsync(fetchTagsInfo(user.name || user.username));
	}, []);
	return (
		<div className="w-full h-full overflow-hidden">
			<ChartOperations chartName={chartName} chartType={chartType} />
			<div className="flex gap-4 w-full mt-4 h-[calc(100vh-144px)]">
				<div className="w-1/2 rounded-lg">
					<ChartOptions option={option} />
				</div>
				<div className="w-1/2 bg-white rounded-lg shadow-md">
					<div className="w-full h-3/4">
						<ChartView option={option} />
					</div>
					<ChartTags />
				</div>
			</div>
		</div>
	);
};

export default page;
