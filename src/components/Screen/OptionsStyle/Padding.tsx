import React from 'react';
import { Slider } from '@/components/ui/slider';
import { changeChartOption } from '@/store/reducers/screenSlice';
import { useAppDispatch } from '@/store/hooks';

const Padding = ({ chartId, chartType, option }: { chartId: string; chartType: string; option: any }) => {
	const dispatch = useAppDispatch();
	const handleValueChange = (value: number, type: string) => {
		dispatch(changeChartOption({ type: 'padding', prop: type, value: value + '%', id: chartId }));
	};
	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">{chartType === 'pie' ? '- Radius' : '- Padding'}</p>
			{chartType === 'pie' ? (
				<>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">radius: </span>
						<Slider
							onValueChange={(value) => handleValueChange(value[0], 'radius')}
							defaultValue={[option.series[0].radius ? parseFloat(option.series[0].radius) : 50]}
							min={30}
							max={80}
							step={2}
						/>
					</div>
				</>
			) : (
				<>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">left: </span>
						<Slider
							onValueChange={(value) => handleValueChange(value[0], 'left')}
							defaultValue={[option.grid[0].left ? parseFloat(option.grid[0].left) : 10]}
							max={30}
							step={0.5}
						/>
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">right: </span>
						<Slider
							onValueChange={(value) => handleValueChange(value[0], 'right')}
							defaultValue={[option.grid[0].right ? parseFloat(option.grid[0].right) : 10]}
							max={30}
							step={0.5}
						/>
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">bottom: </span>
						<Slider
							onValueChange={(value) => handleValueChange(value[0], 'bottom')}
							defaultValue={[option.grid[0].bottom ? parseFloat(option.grid[0].bottom) : 10]}
							max={30}
							step={0.5}
						/>
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">top: </span>
						<Slider
							onValueChange={(value) => handleValueChange(value[0], 'top')}
							defaultValue={[option.grid[0].top ? parseFloat(option.grid[0].top) : 10]}
							max={30}
							step={0.5}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Padding;
