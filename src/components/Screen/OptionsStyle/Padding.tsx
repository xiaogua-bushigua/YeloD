import React from 'react';
import { Slider } from '@/components/ui/slider';
import { changeChartOption } from '@/store/reducers/screenSlice';
import { useAppDispatch } from '@/store/hooks';

const Padding = ({ chartId }: { chartId: string }) => {
	const dispatch = useAppDispatch();
	const handleValueChange = (value: number, type: string) => {
		dispatch(changeChartOption({ type: 'padding', prop: type, value: value + '%', id: chartId }));
	};
	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Padding</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">left: </span>
				<Slider
					onValueChange={(value) => handleValueChange(value[0], 'left')}
					defaultValue={[10]}
					max={30}
					step={0.5}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">right: </span>
				<Slider
					onValueChange={(value) => handleValueChange(value[0], 'right')}
					defaultValue={[10]}
					max={30}
					step={0.5}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">bottom: </span>
				<Slider
					onValueChange={(value) => handleValueChange(value[0], 'bottom')}
					defaultValue={[10]}
					max={30}
					step={0.5}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">top: </span>
				<Slider
					onValueChange={(value) => handleValueChange(value[0], 'top')}
					defaultValue={[10]}
					max={30}
					step={0.5}
				/>
			</div>
		</div>
	);
};

export default Padding;
