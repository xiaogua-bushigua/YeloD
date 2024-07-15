'use client';
import React, { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import ScreenCharts from './ScreenCharts';
import { setFullScreen, setGeometry } from '@/store/reducers/screenSlice';

const Screen = () => {
	const dispatch = useAppDispatch();
	const wrapRef = useRef<HTMLDivElement>(null);
	const screenRef = useRef<HTMLDivElement>(null);
	const { background, title, ratio, fullScreen, charts } = useAppSelector((state: RootState) => state.screen);

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

	const handleMouseOver = (title: HTMLElement, corner: HTMLElement, edit: HTMLElement, style: string) => {
		title.style.display = style;
		corner.style.display = style;
		edit.style.display = style;
	};

	// 选择不同屏幕尺寸时/视口大小改变时，更新大屏背景尺寸
	useEffect(() => {
		handleResizeScreen();
		window.addEventListener('resize', handleResizeScreen);
		return () => {
			window.removeEventListener('resize', handleResizeScreen);
		};
	}, [ratio]);

	// 鼠标移动到图表上时显示一些图标
	useEffect(() => {
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;
		panes.forEach((pane: HTMLElement) => {
			const title = pane.querySelector('.titles') as HTMLElement;
			const corner = pane.querySelector('.corners') as HTMLElement;
			const edit = pane.querySelector('.editIcon') as HTMLElement;

			pane.addEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'block'));
			pane.addEventListener('mouseleave', () => handleMouseOver(title, corner, edit, 'none'));
		});
		return () => {
			panes.forEach((pane: HTMLElement) => {
				const title = pane.querySelector('.titles') as HTMLElement;
				const corner = pane.querySelector('.corners') as HTMLElement;
				const edit = pane.querySelector('.editIcon') as HTMLElement;

				pane.removeEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'block'));
				pane.removeEventListener('mouseleave', () => handleMouseOver(title, corner, edit, 'none'));
			});
		};
	}, []);

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
				const edit = pane.querySelector('.editIcon') as HTMLElement;
				pane.addEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'none'));
			});
			screenRef.current!.requestFullscreen();
			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
			};
		} else {
			panes.forEach((pane: HTMLElement) => {
				const title = pane.querySelector('.titles') as HTMLElement;
				const corner = pane.querySelector('.corners') as HTMLElement;
				const edit = pane.querySelector('.editIcon') as HTMLElement;
				pane.addEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'block'));
			});
		}
	}, [fullScreen]);

	// 表的拖拽和缩放
	useEffect(() => {
		let z = 1;
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;

		panes.forEach((pane: HTMLElement) => {
			const title = pane.querySelector('.titles') as HTMLElement;
			const corner = pane.querySelector('.corners') as HTMLElement;
			const edit = pane.querySelector('.editIcon') as HTMLElement;

			// 两表发生重合时，点击其中一个增大其z，让其排在上面
			const mouseDownHandler = () => {
				z += 1;
				pane.style.zIndex = z.toString();
			};

			// 让title和corner排在pane的更上面，使得能操作
			const mouseEnterHandler = () => {
				title.style.zIndex = (z + 1000).toString();
				corner.style.zIndex = (z + 1000).toString();
				edit.style.zIndex = (z + 1000).toString();
			};

			const mouseOverHandler = () => {
				handleMouseOver(title, corner, edit, 'block');
			};

			const mouseLeaveHandler = () => {
				handleMouseOver(title, corner, edit, 'none');
			};

			const titleMouseDownHandler = (event: MouseEvent) => {
				pane.classList.add('is-dragging-pane');
				const l = pane.offsetLeft;
				const t = pane.offsetTop;
				const startX = event.pageX;
				const startY = event.pageY;

				const drag = (event: MouseEvent) => {
					event.preventDefault();
					pane.style.left = l + (event.pageX - startX) + 'px';
					pane.style.top = t + (event.pageY - startY) + 'px';
				};

				const mouseUp = () => {
					pane.classList.remove('is-dragging-pane');
					dispatch(setGeometry({ type: 'left', value: pane.style.left, id: pane.id }));
					dispatch(setGeometry({ type: 'top', value: pane.style.top, id: pane.id }));
					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseUp);
				};

				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseUp);
			};

			const cornerMouseDownHandler = (event: MouseEvent) => {
				const w = pane.clientWidth;
				const h = pane.clientHeight;
				const startX = event.pageX;
				const startY = event.pageY;

				const drag = (event: MouseEvent) => {
					event.preventDefault();
					pane.style.width = w + (event.pageX - startX) + 'px';
					pane.style.height = h + (event.pageY - startY) + 'px';
				};

				const mouseUp = () => {
					dispatch(setGeometry({ type: 'width', value: pane.style.width, id: pane.id }));
					dispatch(setGeometry({ type: 'height', value: pane.style.height, id: pane.id }));
					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseUp);
				};

				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseUp);
			};

			pane.addEventListener('mousedown', mouseDownHandler);
			pane.addEventListener('mouseenter', mouseEnterHandler);
			pane.addEventListener('mouseover', mouseOverHandler);
			pane.addEventListener('mouseleave', mouseLeaveHandler);
			title.addEventListener('mousedown', titleMouseDownHandler);
			corner.addEventListener('mousedown', cornerMouseDownHandler);

			return () => {
				panes.forEach((pane: HTMLElement) => {
					pane.removeEventListener('mousedown', mouseDownHandler);
					pane.removeEventListener('mouseenter', mouseEnterHandler);
					pane.removeEventListener('mouseover', mouseOverHandler);
					pane.removeEventListener('mouseleave', mouseLeaveHandler);
					const title = pane.querySelector('.titles') as HTMLElement;
					const corner = pane.querySelector('.corners') as HTMLElement;
					title.removeEventListener('mousedown', titleMouseDownHandler);
					corner.removeEventListener('mousedown', cornerMouseDownHandler);
				});
			};
		});
	}, [charts]);

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
						className={`text-center font-mono font-bold text-3xl mt-4 select-none ${
							background === 'light' ? 'text-slate-700' : 'text-slate-50'
						}`}
					>
						{title}
					</p>
				)}
				<ScreenCharts />
			</div>
		</div>
	);
};

export default Screen;
