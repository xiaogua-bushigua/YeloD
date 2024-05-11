'use client';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { setFullScreen, setGeometry } from '@/store/reducers/screenSlice';
import Image from 'next/image';
import ScreenChart from './ScreenChart';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchOptionData } from '@/store/reducers/screenSlice';
import OptionsSheet from './OptionsStyle/OptionsSheet';

const ScreenCharts = ({ screenRef }: { screenRef: React.RefObject<HTMLDivElement> }) => {
	const dispatch = useAppDispatch();
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const { fullScreen, charts, background, staticInterval } = useAppSelector((state: RootState) => state.screen);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [chartId, setChartId] = useState('');

	const handleMouseOver = (title: HTMLElement, corner: HTMLElement, edit: HTMLElement, style: string) => {
		title.style.display = style;
		corner.style.display = style;
		edit.style.display = style;
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
			const edit = pane.querySelector('.editIcon') as HTMLElement;

			pane.addEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'block'));
			pane.addEventListener('mouseleave', () => handleMouseOver(title, corner, edit, 'none'));
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
		}
	}, [fullScreen]);

	useEffect(() => {
		let z = 1;
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;

		panes.forEach((pane: HTMLElement, index: number) => {
			const title = pane.querySelector('.titles') as HTMLElement;
			const corner = pane.querySelector('.corners') as HTMLElement;
			const edit = pane.querySelector('.editIcon') as HTMLElement;

			// 两表发生重合时，点击其中一个增大其z，让其排在上面
			pane.addEventListener('mousedown', () => {
				z = z + 1;
				pane.style.zIndex = z.toString();
			});

			// 让title和corner排在pane的更上面，使得能操作
			pane.addEventListener('mouseenter', () => {
				title.style.zIndex = (z + 1000).toString();
				corner.style.zIndex = (z + 1000).toString();
				edit.style.zIndex = (z + 1000).toString();
			});

			pane.addEventListener('mouseover', () => handleMouseOver(title, corner, edit, 'block'));
			pane.addEventListener('mouseleave', () => handleMouseOver(title, corner, edit, 'none'));

			// 操作title时
			title.addEventListener('mousedown', (event) => {
				pane.classList.add('is-dragging-pane');

				// 记录鼠标按下的时候位置信息
				let l = pane.offsetLeft;
				let t = pane.offsetTop;

				let startX = event.pageX;
				let startY = event.pageY;

				// 鼠标移动时的事件
				const drag = (event: MouseEvent) => {
					event.preventDefault();

					pane.style.left = l + (event.pageX - startX) + 'px';
					pane.style.top = t + (event.pageY - startY) + 'px';

					dispatch(setGeometry({ type: 'left', value: pane.style.left, id: pane.id }));
					dispatch(setGeometry({ type: 'top', value: pane.style.top, id: pane.id }));
				};

				// 鼠标抬起时候的事件
				const mouseup = () => {
					pane.classList.remove('is-dragging-pane');

					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseup);
				};

				// 鼠标按下title的时候添加拖拽和鼠标抬起事件
				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseup);
			});

			// 操作corner时
			corner.addEventListener('mousedown', (event) => {
				let w = pane.clientWidth;
				let h = pane.clientHeight;

				let startX = event.pageX;
				let startY = event.pageY;

				const drag = (event: MouseEvent) => {
					event.preventDefault();

					pane.style.width = w + (event.pageX - startX) + 'px';
					pane.style.height = h + (event.pageY - startY) + 'px';
					dispatch(setGeometry({ type: 'width', value: pane.style.width, id: pane.id }));
					dispatch(setGeometry({ type: 'height', value: pane.style.height, id: pane.id }));
				};

				const mouseup = () => {
					document.removeEventListener('mousemove', drag);
					document.removeEventListener('mouseup', mouseup);
				};

				document.addEventListener('mousemove', drag);
				document.addEventListener('mouseup', mouseup);
			});
		});
	}, [charts]);

	useEffect(() => {
		// 获取所勾选图表对应的数据查询语句的index
		const queryIndexes = charts
			.flatMap((chart) => {
				if (chart.checked) return chart.selectedTags.map((tag) => tag.queryIndex);
				else return null;
			})
			.filter((item) => item !== null);
		const uniqueQueryIndexes = Array.from(new Set(queryIndexes)) as number[];

		// 进行静态更新数据
		if (uniqueQueryIndexes.length) {
			setInterval(() => {
				dispatchAsync(
					fetchOptionData({
						username: user.name || user.username,
						queryIndexes: uniqueQueryIndexes,
					})
				);
			}, staticInterval * 1000 * 60);
		}
	}, []);

	const handleSheetOpenChange = (open: boolean, id: string) => {
		setChartId(open ? id : '');
	};

	return (
		<>
			{charts.map((chart) => {
				if (!chart.checked) return null;
				return (
					<div
						key={chart._id}
						id={chart._id}
						className={`panes absolute rounded-lg border-2 border-transparent`}
						style={{
							width: chart.width || '300px',
							height: chart.height || '240px',
							left: chart.left || '0',
							top: chart.top || '0',
							border: chartId === chart._id ? '2px solid rgb(251, 153, 210)' : '2px solid transparent',
						}}
					>
						<div
							className={`titles cursor-move w-full h-[30px] rounded-t-lg hidden absolute top-0 left-0 ${
								background === 'light' ? 'bg-violet-600 opacity-20' : 'bg-slate-50 opacity-20'
							}`}
						></div>
						<div className="corners cursor-nwse-resize w-[30px] h-[30px] absolute bottom-1 right-1 hidden">
							<Image src={'/imgs/zoom.png'} width={40} height={40} alt="zoom" />
						</div>
						<OptionsSheet
							onOpen={(open) => handleSheetOpenChange(open, chart._id)}
							chartId={chartId}
							chartType={chart.chartType}
							option={chart.option}
						>
							<div className="editIcon cursor-pointer w-[30px] h-[30px] absolute bottom-1 left-1 hidden ">
								<Image src={'/imgs/edit.png'} width={30} height={40} alt="edit" />
							</div>
						</OptionsSheet>
						<ScreenChart chart={chart} />
					</div>
				);
			})}
		</>
	);
};

export default ScreenCharts;
