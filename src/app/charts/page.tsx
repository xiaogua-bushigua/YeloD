'use client';

import ChartCard from '@/components/Chart/ChartCard';
import AddIcon from '@/components/Icons/AddIcon';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetChart, initChart } from '@/store/reducers/chartSlice';
import { RootState } from '@/store/store';
import { ICharts } from '@/lib/models';
import { useToast } from '@/components/ui/use-toast';

import LoadingIcon from '@/components/Icons/LoadingIcon';

export default function Charts() {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [hover, setHover] = useState(false);
	const [cards, setCards] = useState<Array<ICharts>>([]);
  const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	const handleAddClick = () => {
		// 点击新建卡片时，重置所有状态
		dispatch(resetChart());
		router.push('/charts/options');
	};
	// 点击图表卡片时，把图表的信息储存在状态里，以便于带到下一个页面
	const handleChartClick = (chart: ICharts) => {
		dispatch(initChart(chart));
		router.push('/charts/options?id=' + chart._id);
	};
	const handleChartDeleteClick = async (chartId: string) => {
		try {
			const res = await fetch('/api/charts', {
				method: 'DELETE',
				body: JSON.stringify({ username: user.name || user.username, chartId }),
			});
			const { status } = await res.json();
			if (status === 200) {
				fetchData();
				toast({
					title: 'Success',
					description: 'The chart has been removed.',
				});
				// 如果该chart被screen使用了，不让删除
			} else if (status === 202) {
				toast({
					title: 'Suspend',
					description: 'The chart has been used in a screen!',
				});
			} else {
				toast({
					title: 'Error',
					description: 'Something went wrong. Please try again.',
				});
			}
		} catch (error) {
			console.log('Error deleting chart:', error);
		}
	};
	const fetchData = async () => {
		try {
			const res = await fetch(`/api/charts?username=${user.name || user.username}`, {
				method: 'GET',
			});
			const { data } = await res.json();
			setCards(data);
      setLoading(false);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	// 刷新所有charts的option data
	const refreshCharts = async () => {
		try {
			await fetch('/api/charts', {
				method: 'POST',
				body: JSON.stringify({ username: user.name || user.username }),
			});
		} catch (error) {
			console.error('Error refreshing charts:', error);
		}
	};
	useEffect(() => {
		refreshCharts();
		fetchData();
	}, []);
	return (
		<>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center">
					<LoadingIcon size={72} />
				</div>
			) : (
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-y-8">
					{cards?.map((i) => (
						<ChartCard
							onClick={() => handleChartClick(i)}
							key={i._id}
							title={i.chartName}
							cover={i.img}
							onDeleteClick={() => handleChartDeleteClick(i._id)}
						/>
					))}
					<div
						onClick={handleAddClick}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						className="w-56 h-52 flex items-center justify-center cursor-pointer bg-slate-50 p-12 rounded-lg border border-slate-200 hover:shadow-lg"
					>
						<AddIcon fill={hover ? '#2b2b2b' : '#bababa'} />
					</div>
				</div>
			)}
		</>
	);
}
