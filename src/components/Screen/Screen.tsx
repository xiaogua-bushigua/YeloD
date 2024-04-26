'use client';
import React, { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { setFullScreen } from '@/store/reducers/screenSlice';

const Screen = () => {
	const screenRef = useRef<HTMLDivElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();
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

	// 全屏前后保持图表相对于大屏背景的寸尺和位置不变
	useEffect(() => {
		const handleFullScreenChange = () => {
			if (!document.fullscreenElement) {
				dispatch(setFullScreen(false));
			}
		};
		if (fullScreen) {
			document.addEventListener('fullscreenchange', handleFullScreenChange);
			screenRef.current!.requestFullscreen();
			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
			};
		}
	}, [fullScreen]);

	const panes = ['top-0 left-0 bg-slate-500', 'top-[90px] left-[90px] bg-red-500'];
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

			title.addEventListener('mousedown', (event) => {
				pane.classList.add('is-dragging');

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
					pane.classList.remove('is-dragging');

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
		<div ref={wrapRef} className="w-full h-full box-border bg-white rounded-md flex items-center justify-center">
			<div
				ref={screenRef}
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
				{panes.map((pane) => (
					<div key={pane} className={`panes absolute w-[180px] h-[180px] ${pane}`}>
						<div className="titles cursor-move w-full h-[40px] bg-white"></div>
						<div className="corners cursor-nwse-resize w-[20px] h-[20px] absolute bottom-0 right-0 bg-black"></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Screen;
