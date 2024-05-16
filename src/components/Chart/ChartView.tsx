'use client';

import ReactECharts from 'echarts-for-react';
import PubSub from 'pubsub-js';
import { useEffect, useRef, useState } from 'react';
import EChartsReact from 'echarts-for-react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const ChartView = () => {
	const echartRef = useRef<EChartsReact>(null);
	const { chartName, chartType, selectedTags, option } = useAppSelector((state: RootState) => state.chart);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [realOption, setRealOption] = useState({} as any);

	// 订阅点击保存按钮的指令
	useEffect(() => {
		const token = PubSub.subscribe('saveChartThumbnail', async () => {
			const echartInstance = echartRef.current!.getEchartsInstance();
			const base64 = echartInstance.getDataURL();
			const chartInfo = {
				chartName,
				chartType,
				option: realOption,
				selectedTags,
				img: base64,
			};
			const id = searchParams.get('id');
			// 根据id更新数据库中的图表信息
			const res = await fetch('/api/chart', {
				method: 'PATCH',
				body: JSON.stringify({ chartInfo, username: user.name || user.username, id }),
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
		// 下面的依赖都会影像图表的信息，因此都要监听
	}, [selectedTags, chartName, chartType, option, realOption]);

	useEffect(() => {
		const echartInstance = echartRef.current!.getEchartsInstance();
		echartInstance.clear();
		echartInstance.setOption(option);
		setRealOption(echartInstance.getOption());
	}, [option]);

	return <ReactECharts ref={echartRef} option={option} style={{ height: '100%', width: '100%' }} />;
};

export default ChartView;
