'use client';

import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import { setCheckedChart } from '@/store/reducers/screenSlice';
import { newICharts } from '@/store/reducers/screenSlice';

const ChartCheck = ({ info }: { info: newICharts }) => {
  const dispatch = useAppDispatch();
  // 勾选和取消勾选
  const handleCheck = () => {
		dispatch(setCheckedChart(info.chartName));
	};
	return (
		<div
			onClick={handleCheck}
			className="w-56 h-48 rounded-md border border-slate-200 shadow-md hover:shadow-lg hover:border-slate-300 cursor-pointer flex flex-col"
		>
			<div className="flex justify-between p-2">
				<span className="font-mono">{info.chartName}</span>
				<div
					className={`w-5 h-5 border ${
						info.checked ? 'border-violet-500' : 'border-slate-500'
					} rounded-sm flex items-center justify-center bg-transparent`}
				>
					{info.checked && <span className="w-4 h-4 bg-violet-500 rounded-sm"></span>}
				</div>
			</div>
			<div className="w-full h-full flex-1 relative">
				<Image src={info.img} alt="chart" fill className="object-contain" />
			</div>
		</div>
	);
};

export default ChartCheck;
