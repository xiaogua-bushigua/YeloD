'use client';

import ChartCard from '@/components/ChartCard';
import AddIcon from '@/components/icons/AddIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { resetChart } from '@/store/reducers/chartSlice';

export default function Charts() {
  const dispatch = useAppDispatch()
	const [hover, setHover] = useState(false);
	const router = useRouter();
  const handleAddClick = () => {
    dispatch(resetChart())
    router.push('/charts/options')
  }
	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-8 py-6 gap-y-6">
			<ChartCard title="Charts" cover="/imgs/logo.png" />
			<div
				onClick={handleAddClick}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				className="w-48 h-48 flex items-center justify-center cursor-pointer bg-slate-50 p-12 rounded-lg border border-slate-200 hover:shadow-lg"
			>
				<AddIcon fill={hover ? '#2b2b2b' : '#bababa'} />
			</div>
		</div>
	);
}
