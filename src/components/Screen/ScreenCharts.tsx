'use client';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { setFullScreen } from '@/store/reducers/screenSlice';
import Image from 'next/image';
import ScreenChart from './ScreenChart';

const ScreenCharts = ({ screenRef }: { screenRef: React.RefObject<HTMLDivElement> }) => {
	const dispatch = useAppDispatch();
	const { fullScreen, charts, background } = useAppSelector((state: RootState) => state.screen);

	const handleMouseOver = (title: HTMLElement, corner: HTMLElement, style: string) => {
		title.style.display = style;
		corner.style.display = style;
	};
	// 全屏前后保持图表相对于大屏背景的寸尺和位置不变
	useEffect(() => {
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;
		let preSize = [] as number[][];
		let prePosition = [] as number[][];
		// 获取全屏变化前的screenRef宽高
		const preFullScreenWidth = screenRef.current!.offsetWidth;
		const preFullScreenHeight = screenRef.current!.offsetHeight;
		panes.forEach((pane: HTMLElement) => {
			// 获取全屏变化前图表相对于大屏背景的位置
			const preXPercent = pane.offsetLeft / preFullScreenWidth;
			const preYPercent = pane.offsetTop / preFullScreenHeight;
			const preWidth = pane.offsetWidth;
			const preHeight = pane.offsetHeight;
			prePosition.push([preXPercent, preYPercent]);
			preSize.push([preWidth, preHeight]);

			const title = pane.querySelector('.titles') as HTMLElement;
			const corner = pane.querySelector('.corners') as HTMLElement;

			pane.addEventListener('mouseover', () => handleMouseOver(title, corner, 'block'));
			pane.addEventListener('mouseleave', () => handleMouseOver(title, corner, 'none'));
		});

		const handleFullScreenChange = () => {
			if (!document.fullscreenElement) {
				dispatch(setFullScreen(false));
			}
			// 获取全屏变化后的screenRef宽高
			const postFullScreenWidth = screenRef.current!.offsetWidth;
			const postFullScreenHeight = screenRef.current!.offsetHeight;
			// 计算宽高变化比例
			const widthRatio = postFullScreenWidth / preFullScreenWidth;
			const heightRatio = postFullScreenHeight / preFullScreenHeight;
			panes.forEach((pane: HTMLElement, index: number) => {
				// 根据变化比例更新size和position
				pane.style.width = preSize[index][0] * widthRatio + 'px';
				pane.style.height = preSize[index][1] * heightRatio + 'px';
				pane.style.left = prePosition[index][0] * postFullScreenWidth + 'px';
				pane.style.top = prePosition[index][1] * postFullScreenHeight + 'px';
			});
		};
		if (fullScreen) {
			document.addEventListener('fullscreenchange', handleFullScreenChange);
			panes.forEach((pane: HTMLElement) => {
				const title = pane.querySelector('.titles') as HTMLElement;
				const corner = pane.querySelector('.corners') as HTMLElement;
				pane.addEventListener('mouseover', () => handleMouseOver(title, corner, 'none'));
			});
			screenRef.current!.requestFullscreen();
			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
			};
		}
	}, [fullScreen]);

	useEffect(() => {
		let z = 1;
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;

		panes.forEach((pane: HTMLElement) => {
			const title = pane.querySelector('.titles') as HTMLElement;
			const corner = pane.querySelector('.corners') as HTMLElement;

			pane.addEventListener('mousedown', () => {
				z = z + 1;
				pane.style.zIndex = z.toString();
			});

			pane.addEventListener('mouseenter', () => {
				title.style.zIndex = (z + 1000).toString();
				corner.style.zIndex = (z + 1000).toString();
			});

			title.addEventListener('mousedown', (event) => {
				pane.classList.add('is-dragging-pane');

				let l = pane.offsetLeft;
				let t = pane.offsetTop;

				let startX = event.pageX;
				let startY = event.pageY;

				const drag = (event: MouseEvent) => {
					event.preventDefault();

					pane.style.left = l + (event.pageX - startX) + 'px';
					pane.style.top = t + (event.pageY - startY) + 'px';
				};

				const mouseup = () => {
					pane.classList.remove('is-dragging-pane');

					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseup);
				};

				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseup);
			});

			corner.addEventListener('mousedown', (event) => {
				let w = pane.clientWidth;
				let h = pane.clientHeight;

				let startX = event.pageX;
				let startY = event.pageY;

				const drag = (event: MouseEvent) => {
					event.preventDefault();

					pane.style.width = w + (event.pageX - startX) + 'px';
					pane.style.height = h + (event.pageY - startY) + 'px';
				};

				const mouseup = () => {
					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseup);
				};

				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseup);
			});
		});
	}, []);
	return (
		<>
			{charts.map((chart) => (
				<div
					key={chart._id}
					className={`panes absolute w-[300px] h-[240px] rounded-lg border-2 border-transparent`}
				>
					<div
						className={`titles cursor-move w-full h-[30px] rounded-t-lg hidden absolute top-0 left-0 ${
							background === 'light' ? 'bg-violet-600 opacity-20' : 'bg-slate-50 opacity-20'
						}`}
					></div>
					<div className="corners cursor-nwse-resize w-[30px] h-[30px] absolute bottom-1 right-1 hidden">
						<Image src={'/imgs/zoom.png'} width={40} height={40} alt="zoom" />
					</div>
					<ScreenChart chart={chart} />
				</div>
			))}
		</>
	);
};

export default ScreenCharts;
