'use client';

import React, { useState, useEffect } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useAppDispatch } from '@/store/hooks';
import { changeChartOption } from '@/store/reducers/screenSlice';

const Axis = ({ chartId }: { chartId: string; }) => {
	const [color, setColor] = useColor('#bfbfbf');
	const dispatch = useAppDispatch();
	const [popoverOpen, setPopoverOpen] = useState(false);

	useEffect(() => {
		if (!popoverOpen) {
			dispatch(changeChartOption({ type: 'axis', prop: 'color', value: color.hex, id: chartId }));
		}
	}, [popoverOpen]);

	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Axis</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">size: </span>
				<Slider
					defaultValue={[12]}
					max={20}
					min={8}
					step={1}
					onValueChange={(value) =>
						dispatch(changeChartOption({ type: 'axis', prop: 'fontSize', value: value, id: chartId }))
					}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">color: </span>
				<Popover modal={true} open={popoverOpen} onOpenChange={(value) => setPopoverOpen(value)}>
					<PopoverTrigger>
						<div
							className="w-10 h-5 rounded-md  border-2 border-violet-400"
							style={{ backgroundColor: color.hex }}
						></div>
					</PopoverTrigger>
					<PopoverContent sideOffset={24} side="left">
						<ColorPicker color={color} onChange={setColor} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default Axis;
