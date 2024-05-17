'use client';

import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { useAppDispatch } from '@/store/hooks';
import { changeChartOption } from '@/store/reducers/screenSlice';

const Legend = ({ chartId, option }: { chartId: string; option: any }) => {
	const dispatch = useAppDispatch();
	const [color, setColor] = useColor(option.legend[0].textStyle.color || '#333');
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [checked, setChecked] = useState(option.legend[0].orient !== 'horizontal');

	const handleShowLegendChange = (checked: boolean) => {
		setChecked(checked);
		dispatch(
			changeChartOption({
				type: 'legend',
				prop: 'orient',
				value: checked ? 'vertical' : 'horizontal',
				id: chartId,
			})
		);
	};

	useEffect(() => {
		if (!popoverOpen) {
			dispatch(changeChartOption({ type: 'legend', prop: 'color', value: color.hex, id: chartId }));
		}
	}, [popoverOpen]);

	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Legend</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">orient: </span>
				<Switch checked={checked} onCheckedChange={(checked: boolean) => handleShowLegendChange(checked)} />
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">left: </span>
				<Slider
					defaultValue={[option.legend[0].left || 10]}
					max={80}
					min={0}
					step={1}
					onValueChange={(value) =>
						dispatch(changeChartOption({ type: 'legend', prop: 'left', value: value, id: chartId }))
					}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">top: </span>
				<Slider
					defaultValue={[option.legend[0].top || 0]}
					max={20}
					min={-16}
					step={1}
					onValueChange={(value) =>
						dispatch(changeChartOption({ type: 'legend', prop: 'top', value: value, id: chartId }))
					}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">size: </span>
				<Slider
					defaultValue={[option.legend[0].textStyle.fontSize || 12]}
					max={24}
					min={10}
					step={1}
					onValueChange={(value) =>
						dispatch(changeChartOption({ type: 'legend', prop: 'fontSize', value: value, id: chartId }))
					}
				/>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">color: </span>
				<Popover modal={true} open={popoverOpen} onOpenChange={(value) => setPopoverOpen(value)}>
					<PopoverTrigger>
						<div
							className="w-10 h-5 rounded-md border-2 border-violet-400"
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

export default Legend;
