'use client';

import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useAppDispatch } from '@/store/hooks';
import { changeChartOption } from '@/store/reducers/screenSlice';

const Title = ({ chartId }: { chartId: string }) => {
	const [color, setColor] = useColor('#561ecb');
	const [checked, setChecked] = useState(false);
  const [title, setTitle] = useState('')
	const dispatch = useAppDispatch();
	const [popoverOpen, setPopoverOpen] = useState(false);

	const handleShowLabelChange = (checked: boolean) => {
		setChecked(checked);
		dispatch(changeChartOption({ type: 'title', prop: 'show', value: checked, id: chartId }));
	};

  const handleInputChange = (value: string) => {
    setTitle(value);
    dispatch(changeChartOption({ type: 'title', prop: 'text', value, id: chartId }));
  }

	useEffect(() => {
		if (!popoverOpen) {
			dispatch(changeChartOption({ type: 'title', prop: 'color', value: color.hex, id: chartId }));
		}
	}, [popoverOpen]);
	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Title</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">show: </span>
				<Switch checked={checked} onCheckedChange={(checked: boolean) => handleShowLabelChange(checked)} />
			</div>
			{checked && (
				<>
					<div className="flex pl-4 my-2 items-center">
						<span className="font-mono mr-4 w-24 text-sm">content: </span>
						<Input
							className="text-sm h-8"
							value={title}
							onChange={(e) => handleInputChange(e.target.value)}
						/>
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-24 text-sm">fontSize: </span>
						<Slider
							defaultValue={[18]}
							max={24}
							min={12}
							step={1}
							onValueChange={(value) =>
								dispatch(
									changeChartOption({ type: 'title', prop: 'fontSize', value: value, id: chartId })
								)
							}
						/>{' '}
					</div>
					<div className="flex pl-4 my-1 items-center">
						<span className="font-mono mr-4 w-[60px] text-sm">color: </span>
						<Popover open={popoverOpen} onOpenChange={(value) => setPopoverOpen(value)}>
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

export default Title;
