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
	useEffect(() => {
		if (chartRef) {
			const echartInstance = chartRef!.getEchartsInstance();
			const option = echartInstance.getOption();
			setOption(option);
		}
	}, [chartRef]);

	return (
		<Sheet onOpenChange={(open) => onOpen(open)}>
			<SheetTrigger>{children}</SheetTrigger>
			<SheetContent className="w-72 min-w-72 overflow-auto">
				<SheetHeader>
					<SheetTitle className="my-4 font-mono">Change chart styles</SheetTitle>
				</SheetHeader>
				<Padding chartId={chartId} chartType={chartType} />
				<Label chartId={chartId} chartType={chartType} />
				<Title chartId={chartId} />
				{chartType !== 'pie' && <Axis chartId={chartId} />}
				<Legend chartId={chartId} />
				<DataSeries chartId={chartId} option={option} />
			</SheetContent>
		</Sheet>
	);
};

export default OptionsSheet;
