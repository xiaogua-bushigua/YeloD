'use client';

import ReactECharts from 'echarts-for-react';
import PubSub from 'pubsub-js';
import { useEffect, useRef } from 'react';
import EChartsReact from 'echarts-for-react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const ChartView = ({ option }: { option: any }) => {
	const echartRef = useRef<EChartsReact>(null);
	const { toast } = useToast();
	const router = useRouter();
	const { chartName, chartType, selectedTags } = useAppSelector((state: RootState) => state.chart);
	const { user } = useAppSelector((state: RootState) => state.auth);
	useEffect(() => {
		const token = PubSub.subscribe('saveChartThumbnail', async () => {
			const echartInstance = echartRef.current!.getEchartsInstance();
			const base64 = echartInstance.getDataURL();
			const chartInfo = {
				chartName,
				chartType,
				option,
				selectedTags,
				img: base64,
			};
			const res = await fetch('/api/chart', {
				method: 'PATCH',
				body: JSON.stringify({ chartInfo, username: user.name || user.username }),
			});
			const { status } = await res.json();
			if (status === 200) {
				toast({
					title: 'Success',
					description: 'The chart has been saved.',
				});
				router.push('/charts');
			} else {
				toast({
					title: 'Error',
					description: 'Something went wrong. Please try again.',
				});
			}
		});
		return () => {
			PubSub.unsubscribe(token);
		};
	}, [selectedTags, chartName, chartType, option]);
	return <ReactECharts ref={echartRef} option={option} style={{ height: '100%', width: '100%' }} />;
};

export default ChartView;
