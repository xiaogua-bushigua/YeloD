'use client';

import React, { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { useAppDispatch } from '@/store/hooks';
import { changeChartOption } from '@/store/reducers/screenSlice';

const Label = ({ chartId, chartType, option }: { chartId: string; chartType: string; option: any }) => {
	const dispatch = useAppDispatch();
	const [color, setColor] = useColor(option.series[0].label.color || '#666');
	const [checked, setChecked] = useState(
		option.series[0].label.show === undefined ? false : option.series[0].label.show
	);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [position, setPosition] = useState(
		chartType === 'pie' ? option.series[0].label.position || 'inside' : option.series[0].label.position || 'top'
	);
	const positionItems = [
		'top',
		'left',
		'right',
		'bottom',
		'inside',
		'insideLeft',
		'insideRight',
		'insideTop',
		'insideBottom',
		'insideTopLeft',
		'insideBottomLeft',
		'insideTopRight',
		'insideBottomRight',
	];
	const positionItemsPie = ['outside', 'inside', 'center'];

	const handleShowLabelChange = (checked: boolean) => {
		setChecked(checked);
		dispatch(changeChartOption({ type: 'label', prop: 'show', value: checked, id: chartId }));
	};
	const handlePositionChange = (position: string) => {
		setPosition(position);
		dispatch(changeChartOption({ type: 'label', prop: 'position', value: position, id: chartId }));
	};

	useEffect(() => {
		if (!popoverOpen) {
			dispatch(changeChartOption({ type: 'label', prop: 'color', value: color.hex, id: chartId }));
		}
	}, [popoverOpen]);

	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Label</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">show: </span>
				<Switch checked={checked} onCheckedChange={(checked: boolean) => handleShowLabelChange(checked)} />
			</div>
			{checked && (
				<>
					<div className="flex pl-4 my-2 items-center">
						<span className="font-mono mr-4 w-24 text-sm">position: </span>
						<Select value={position} onValueChange={(value) => handlePositionChange(value)}>
							<SelectTrigger className="font-mono text-sm h-8 -ml-2">
								<SelectValue placeholder="Select a type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel className="font-mono">positions</SelectLabel>
									{(chartType === 'pie' ? positionItemsPie : positionItems).map((position) => (
										<SelectItem className="font-mono" value={position} key={position}>
											{position}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">size: </span>
						<Slider
							defaultValue={[option.series[0].label.fontSize || 12]}
							max={24}
							min={10}
							step={1}
							onValueChange={(value) =>
								dispatch(
									changeChartOption({ type: 'label', prop: 'fontSize', value: value, id: chartId })
								)
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
				</>
			)}
		</div>
	);
};

export default Label;
