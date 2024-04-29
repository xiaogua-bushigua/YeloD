'use client';
import ScreenCard from '@/components/Chart/ChartCard';
import AddIcon from '@/components/Icons/AddIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Screens() {
	const [hover, setHover] = useState(false);
	const router = useRouter();
	const handleAddClick = () => {
		router.push('/screens/configurations');
	};

	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-y-8">
			<ScreenCard onClick={() => console.log(123)} title={'screen title'} cover={'/imgs/login.png'} />
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
