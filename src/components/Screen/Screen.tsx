'use client';
import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

// codesandbox.io/p/sandbox/react-grid-layout-example-c1pcef?file=%2Fpackage.json
//codesandbox.io/p/sandbox/react-grid-layout-from-typescript-forked-63jmw7?file=%2Fpackage.json%3A9%2C27

const Screen = () => {
	const screenRef = useRef<HTMLDivElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const { background, title, ratio, fullScreen } = useAppSelector((state: RootState) => state.screen);

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

	return (
		<div ref={wrapRef} className="w-full h-full box-border bg-white rounded-md flex items-center justify-center">
			<div
				ref={screenRef}
				className={`bg-slate-50 border border-slate-300 bg-cover ${
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
			</div>
		</div>
	);
};

export default Screen;
