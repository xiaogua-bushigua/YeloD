'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Padding from './Padding';
import Label from './Label';
import Title from './Title';
import Axis from './Axis';
import DataSeries from './DataSeries';
import Legend from './Legend';
import EChartsReact from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { newICharts } from '@/store/reducers/screenSlice';

const OptionsSheet = ({
	children,
	onOpen,
	chartId,
	chartType,
	chartRef,
}: Readonly<{
	children: React.ReactNode;
	onOpen: (open: boolean) => void;
	chartId: string;
	chartType: string;
	chartRef: EChartsReact;
}>) => {
	const [option, setOption] = useState({} as any);
	const [open, setOpen] = useState(false);
	const [nowId, setNowId] = useState('');
	const [nowChartRef, setNowChartRef] = useState<EChartsReact | null>();
	const { charts } = useAppSelector((state: RootState) => state.screen);
	const { user } = useAppSelector((state: RootState) => state.auth);

	const handleSheetOpen = (open: boolean) => {
		setOpen(open);
		onOpen(open);
	};

	const updateChart = async (chartInfo: any) => {
		try {
			// 根据id更新数据库中的图表信息
			await fetch('/api/chart', {
				method: 'PATCH',
				body: JSON.stringify({ chartInfo, username: user.name || user.username, id: nowId }),
			});
		} catch (error) {
      console.log('Error updating chart:', error);
    }
	};

	useEffect(() => {
		if (chartRef) {
			const echartInstance = chartRef!.getEchartsInstance();
			const option = echartInstance.getOption();
			setOption(option);
		}
	}, [chartRef]);
	useEffect(() => {
		if (open && chartId) {
			setNowId(chartId);
			setNowChartRef(chartRef);
		}
		if (!open && nowId) {
			const chart = charts.filter((c: newICharts) => c._id === nowId)[0];
			const echartInstance = nowChartRef!.getEchartsInstance();
			const base64 = echartInstance.getDataURL();
			const chartInfo = {
				chartName: chart.chartName,
				chartType: chart.chartType,
				option: chart.option,
				selectedTags: chart.selectedTags,
				img: base64,
			};
			updateChart(chartInfo);
		}
	}, [open]);

	return (
		<Sheet open={open} onOpenChange={(open) => handleSheetOpen(open)}>
			<SheetTrigger>{children}</SheetTrigger>
			<SheetContent className="w-72 min-w-72 overflow-auto">
				<SheetHeader>
					<SheetTitle className="my-4 font-mono">Change chart styles</SheetTitle>
				</SheetHeader>
				{Object.keys(option).length && (
					<>
						<Padding chartId={chartId} chartType={chartType} option={option} />
						<Label chartId={chartId} chartType={chartType} option={option} />
						<Title chartId={chartId} option={option} />
						{chartType !== 'pie' && <Axis chartId={chartId} option={option} />}
						<Legend chartId={chartId} option={option} />
						<DataSeries chartId={chartId} option={option} chartType={chartType} />
					</>
				)}
			</SheetContent>
		</Sheet>
	);
};

export default OptionsSheet;
