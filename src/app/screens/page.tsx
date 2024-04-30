'use client';
import ScreenCard from '@/components/Chart/ChartCard';
import AddIcon from '@/components/Icons/AddIcon';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { IScreens } from '@/lib/models';
import { initScreen, resetScreen } from '@/store/reducers/screenSlice';

export default function Screens() {
	const [hover, setHover] = useState(false);
	const [cards, setCards] = useState<Array<IScreens>>();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleAddClick = () => {
		// 点击新建卡片时，重置所有状态
		dispatch(resetScreen());
		router.push('/screens/configurations');
	};
	const handleScreenClick = async (screen: IScreens) => {
		const res = await fetch('/api/screen', {
			method: 'POST',
			body: JSON.stringify({ username: user.name || user.username, chartsInfo: screen.chartsInfo }),
		});
		const { data } = await res.json();
		dispatch(initScreen({...screen, charts: data}));
		router.push('/screens/configurations?id=' + screen._id);
	};
	const fetchData = async () => {
		const res = await fetch(`/api/screen?username=${user.name || user.username}`, {
			method: 'GET',
		});
		const { data } = await res.json();
		setCards(data);
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-y-8">
			{cards?.map((screen: IScreens) => (
				<ScreenCard
					onClick={() => handleScreenClick(screen)}
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
