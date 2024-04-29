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
import dynamic from 'next/dynamic';

// EditorJS不支持服务端渲染，这里使用客户端渲染
const ChartOptions = dynamic(() => import('@/components/Chart/ChartOptions'), { ssr: false });

const page = () => {
	const { option, chartName, chartType } = useAppSelector((state: RootState) => state.chart);
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
	useEffect(() => {
		// 获取所有的tag标签和该标签对应的查询信息
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
						<ChartView />
					</div>
					<ChartTags />
				</div>
			</div>
		</div>
	);
};

export default page;
