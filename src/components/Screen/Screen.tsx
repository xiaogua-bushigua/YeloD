'use client';
import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import ScreenCharts from './ScreenCharts';

const Screen = () => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const screenRef = useRef<HTMLDivElement>(null);
	const { background, title, ratio, charts } = useAppSelector((state: RootState) => state.screen);
	const { user } = useAppSelector((state: RootState) => state.auth);

	const handleResizeScreen = () => {
		const [w, h] = ratio.split(':').map(Number);
		const [wrapWidth, wrapHeight] = [
			wrapRef.current!.getBoundingClientRect().width,
			wrapRef.current!.getBoundingClientRect().height,
		];
		if (wrapHeight < wrapWidth) {
			screenRef.current!.style.height = '100%';
			screenRef.current!.style.width = wrapRef.current!.getBoundingClientRect().height * (w / h) + 'px';
		} else {
			screenRef.current!.style.width = '100%';
			screenRef.current!.style.height = wrapRef.current!.getBoundingClientRect().width * (h / w) + 'px';
		}
	};

	// 选择不同屏幕尺寸时/视口大小改变时，更新大屏背景尺寸
	useEffect(() => {
		handleResizeScreen();
		window.addEventListener('resize', handleResizeScreen);
		return () => {
			window.removeEventListener('resize', handleResizeScreen);
		};
	}, [ratio]);

	useEffect(() => {
		// 把带着最新data的option保存到数据库中各自的chart里
		charts.forEach((chart) => {
			const chartInfo = {
				chartName: chart.chartName,
				chartType: chart.chartType,
				option: chart.option,
				selectedTags: chart.selectedTags,
				img: chart.img,
				_id: chart._id,
			};
			fetch('/api/chart', {
				method: 'PATCH',
				body: JSON.stringify({ chartInfo, username: user.name || user.username, id: chart._id }),
			});
		});
	}, []);

	return (
		<div ref={wrapRef} className="w-full h-full box-border bg-white rounded-md flex items-center justify-center">
			<div
				ref={screenRef}
				id="yeloD"
				className={`bg-slate-50 relative border border-slate-300 bg-cover ${
					background === 'light' ? "bg-[url('/imgs/light.png')]" : "bg-[url('/imgs/dark.png')]"
				}`}
			>
				{title && (
					<p
						className={`text-center font-mono font-bold text-3xl mt-4 ${
							background === 'light' ? 'text-slate-700' : 'text-slate-50'
						}`}
					>
						{title}
					</p>
				)}
				<ScreenCharts screenRef={screenRef} />
			</div>
		</div>
	);
};

export default Screen;
