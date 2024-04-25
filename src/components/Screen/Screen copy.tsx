'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Rnd } from 'react-rnd';
import { setFullScreen } from '@/store/reducers/screenSlice';

const style = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: '#d43737',
} as const;

const Screen = () => {
	const dispatch = useAppDispatch();
	const screenRef = useRef<HTMLDivElement>(null);
	const rndRef = useRef<Rnd>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const { background, title, ratio, fullScreen } = useAppSelector((state: RootState) => state.screen);
	const [size, setSize] = useState([200, 200]); // width, height
	const [position, setPosition] = useState([0, 0]); // x, y

	// 选择不同屏幕尺寸时，更新大屏背景尺寸
	useEffect(() => {
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
	}, [ratio]);

	// 全屏前后保持图表相对于大屏背景的寸尺和位置不变
	useEffect(() => {
		// 获取全屏变化前的 screenRef 宽高
		const preFullScreenWidth = screenRef.current!.offsetWidth;
		const preFullScreenHeight = screenRef.current!.offsetHeight;
		// 获取全屏变化前图表相对于大屏背景的位置
		const preXPercent = position[0] / preFullScreenWidth;
		const preYPercent = position[1] / preFullScreenHeight;
		// 执行全屏变化请求
		const handleFullScreenChange = () => {
			if (!document.fullscreenElement) {
				// 在这里执行取消全屏后的操作
				dispatch(setFullScreen(false));
			}
			// 监听全屏变化事件，以获取全屏后的 screenRef 宽高
			const postFullScreenWidth = screenRef.current!.offsetWidth;
			const postFullScreenHeight = screenRef.current!.offsetHeight;
			// 计算宽高变化比例
			const widthRatio = postFullScreenWidth / preFullScreenWidth;
			const heightRatio = postFullScreenHeight / preFullScreenHeight;
			// 根据变化比例更新 size 状态
			setSize([size[0] * widthRatio, size[1] * heightRatio]);
			// 根据变化比例更新 position 状态
			setPosition([preXPercent * postFullScreenWidth, preYPercent * postFullScreenHeight]);
			console.log(rndRef.current);
		};
		if (fullScreen) {
			document.addEventListener('fullscreenchange', handleFullScreenChange);
			screenRef.current!.requestFullscreen();
			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
			};
		}
	}, [fullScreen]);
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
				<Rnd
					ref={rndRef}
					style={style}
					bounds="parent"
					position={{
						x: position[0],
						y: position[1],
					}}
					size={{
						width: size[0],
						height: size[1],
					}}
					onDragStop={(e: any, d: any) => {
						setPosition([d.x, d.y]);
					}}
					onResizeStop={(e: any, direction: any, ref: any, delta: any) => {
						setSize([ref.offsetWidth, ref.offsetHeight]);
					}}
				>
					Rnd
				</Rnd>
			</div>
		</div>
	);
};

export default Screen;
