'use client';
import ScreenCard from '@/components/Chart/ChartCard';
import AddIcon from '@/components/Icons/AddIcon';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { IScreens } from '@/lib/models';
import { initScreen, resetScreen } from '@/store/reducers/screenSlice';
import { useToast } from '@/components/ui/use-toast';
import { initCharts } from '@/store/reducers/screenSlice';

export default function Screens() {
	const [hover, setHover] = useState(false);
	const [cards, setCards] = useState<Array<IScreens>>();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const router = useRouter();
	const { toast } = useToast();
	const dispatch = useAppDispatch();

	// 点击新建卡片时，重置所有状态
	const handleAddClick = () => {
		dispatch(resetScreen());
		router.push('/screens/configurations');
	};

	// 点击已有卡片时，填入对应信息
	const handleScreenClick = async (screen: IScreens) => {
		try {
			const res = await fetch('/api/screens', {
				method: 'POST',
				body: JSON.stringify({ username: user.name || user.username, chartsInfo: screen.chartsInfo }),
			});
			const { data } = await res.json();
			dispatch(initScreen({ ...screen, charts: data }));
			router.push('/screens/configurations?id=' + screen._id);
		} catch (error) {
			console.error('Error clicking screen:', error);
		}
	};

	const handleScreenDeleteClick = async (screenId: string) => {
		try {
			fetch('/api/screens', {
				method: 'DELETE',
				body: JSON.stringify({ username: user.name || user.username, screenId }),
			})
				.then(() => {
					fetchScreenCards();
					toast({
						title: 'Success',
						description: 'The screen has been removed.',
					});
				})
				.catch((error) => {
					console.error('Error:', error);
					toast({
						title: 'Error',
						description: 'Something went wrong. Please try again.',
					});
				});
		} catch (error) {
			console.error('Error deleting screen:', error);
		}
	};

	// 初始化所有的屏幕卡片
	const fetchScreenCards = async () => {
		try {
			const res = await fetch(`/api/screens?username=${user.name || user.username}`, {
				method: 'GET',
			});
			const { data } = await res.json();
			setCards(data);
		} catch (error) {
			console.error('Error fetching screens data:', error);
		}
	};

	// 初始化抽屉里待勾选的图表
	const fetchCharts = async () => {
		try {
			const chartsRes = await fetch(`/api/charts?username=${user.name || user.username}`, {
				method: 'GET',
			});
			let { data } = await chartsRes.json();
			dispatch(initCharts({ charts: data }));
		} catch (error) {
			console.error('Error fetching charts data:', error);
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
		fetchScreenCards();
		fetchCharts();
	}, []);

	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-y-8">
			{cards?.map((screen: IScreens) => (
				<ScreenCard
					onClick={() => handleScreenClick(screen)}
					onDeleteClick={() => handleScreenDeleteClick(screen._id)}
					key={screen._id}
					title={screen.screenName}
					cover={screen.screenImg}
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
	);
}
