'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { staticRefreshOptionData, newICharts, dynamicRefreshOptionData } from '@/store/reducers/screenSlice';
import Image from 'next/image';
import OptionsSheet from './OptionsStyle/OptionsSheet';
import EChartsReact from 'echarts-for-react';
import { IQuery } from '@/lib/models';
import ReactECharts from 'echarts-for-react';

const ScreenCharts = React.memo(() => {
	const dispatch = useAppDispatch();
	const { charts, background, staticInterval, dynamicInterval, drawCloseFlag } = useAppSelector(
		(state: RootState) => state.screen
	);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [chartId, setChartId] = useState('');
	const childRef = useRef<EChartsReact[] | null[]>([]);
	const eventSourcesRef = useRef<EventSource[]>([]);

	const setupStaticUpdate = async (chart: newICharts, index: number) => {
		try {
			await fetch('/api/charts', {
				method: 'POST',
				body: JSON.stringify({ username: user.name || user.username }),
			});
			const res = await fetch(`/api/charts/${chart._id}?username=${user.name || user.username}`, {
				method: 'GET',
			});
			const { data } = await res.json();
			dispatch(staticRefreshOptionData({ data, index }));
		} catch (error) {
			console.log("Error updating charts' option data:", error);
		}
	};

	const handleEventSourceError = (eventSource: EventSource) => {
		eventSource.close();
	};
	const handleEventSourceMessage = (event: any) => {
		const { info } = JSON.parse(event.data);
		dispatch(dynamicRefreshOptionData(info));
	};
	const setupEventSource = async (chart: newICharts) => {
		let queryIds: string[] = chart.selectedTags
			.filter((selectedTag) => !selectedTag.xAxis)
			.map((selectedTag) => selectedTag.queryId);

		if (chart.chartType === 'line' || chart.chartType === 'bar') {
			const xAxisQueryId = chart.selectedTags.find((selectedTag) => selectedTag.xAxis)?.queryId;
			if (xAxisQueryId) {
				queryIds.unshift(xAxisQueryId);
			}
		}

		try {
			const res = await fetch(`/api/dbQueries?username=${user.name || user.username}`, {
				method: 'GET',
			});
			let { queries } = await res.json();
			queries = queryIds.map((id) => queries.queries.find((query: IQuery) => query._id === id));

			setTimeout(() => {
				const eventSource = new EventSource(
					`/api/events?params=${JSON.stringify(queries)}&interval=${dynamicInterval * 1000}`
				);
				eventSource.addEventListener('message', handleEventSourceMessage);
				eventSource.onerror = () => handleEventSourceError(eventSource);
				eventSourcesRef.current.push(eventSource);
			}, 2000);
		} catch (error) {
			console.log('Error setting up event source:', error);
		}
	};
	useEffect(() => {
		const intervals: NodeJS.Timeout[] = [];

		const setupChart = async (chart: newICharts, index: number) => {
			if (chart.checked) {
				if (chart.updateMode === 'static') {
					intervals[index] = setInterval(() => setupStaticUpdate(chart, index), staticInterval * 1000 * 60);
				} else {
					await setupEventSource(chart);
				}
			}
		};

		charts.forEach(setupChart);

		return () => {
			intervals.forEach((interval) => {
				if (interval) clearInterval(interval);
			});
			eventSourcesRef.current.forEach((eventSource) => {
				console.log('event closed');
				eventSource.removeEventListener('message', handleEventSourceMessage);
				eventSource.close();
			});
			eventSourcesRef.current = [];
		};
	}, []);

	const handleSheetOpenChange = (open: boolean, id: string) => {
		setChartId(id);
		const panes = document.querySelectorAll('.panes') as NodeListOf<HTMLElement>;
		const borderStyle = open ? '2px solid rgb(251, 153, 210)' : '2px solid transparent';
		panes.forEach((pane: HTMLElement) => {
			if (pane.id === id) {
				pane.style.border = borderStyle;
			}
		});
	};

  useEffect(() => {}, [drawCloseFlag, dynamicInterval, staticInterval]);

	return (
		<>
			{charts.map((chart, index) => {
				if (!chart.checked) return null;
				return (
					<div
						key={chart._id}
						id={chart._id}
						className={'panes absolute rounded-lg border-2 border-transparent'}
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
						<div className="corners cursor-nwse-resize w-[30px] h-[30px] absolute bottom-1 right-1 hidden select-none">
							<Image src={'/imgs/zoom.png'} width={40} height={40} alt="zoom" />
						</div>
						<OptionsSheet
							onOpen={(open) => handleSheetOpenChange(open, chart._id)}
							chartId={chartId}
							chartType={chart.chartType}
							chartRef={childRef.current[index]!}
						>
							<div className="editIcon cursor-pointer w-[30px] h-[30px] absolute bottom-1 left-1 hidden select-none">
								<Image src={'/imgs/edit.png'} width={30} height={40} alt="edit" />
							</div>
						</OptionsSheet>
						<ReactECharts
							ref={(ref) => {
								childRef.current[index] = ref;
							}}
							option={chart.option}
							style={{ height: '100%', width: '100%' }}
						/>
					</div>
				);
			})}
		</>
	);
});

export default ScreenCharts;
