'use client';

import React, { useState, useEffect } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/store/hooks';
import { changeChartOption } from '@/store/reducers/screenSlice';

const PieSerie = ({
	chartId,
	index,
	serie,
	scolor,
  chartType
}: {
	chartId: string;
	index: number;
	serie: any;
	scolor: string;
  chartType: string;
}) => {
	const dispatch = useAppDispatch();
	const [color, setColor] = useColor(
		serie.itemStyle ? (serie.itemStyle.color ? serie.itemStyle.color : scolor) : scolor
	);
	const [serieName, setSerieName] = useState(serie.name);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const handleInputChange = (value: string) => {
		setSerieName(value);
		dispatch(changeChartOption({ type: 'series', prop: 'name', value, id: chartId, index, chartType }));
	};
	useEffect(() => {
		if (!popoverOpen) {
			dispatch(changeChartOption({ type: 'series', prop: 'color', value: color.hex, id: chartId, index, chartType }));
		}
	}, [popoverOpen]);
	return (
		<div className="flex pl-4 my-1 items-center">
			<span className="font-mono mr-4 w-[60px] text-sm">{'series' + (index + 1) + ': '}</span>
			<Input className="text-sm h-8" value={serieName} onChange={(e) => handleInputChange(e.target.value)} />
			<Popover modal={true} open={popoverOpen} onOpenChange={(value) => setPopoverOpen(value)}>
				<PopoverTrigger>
					<div
						className="w-12 h-5 rounded-md ml-2 flex items-center justify-center text-xs font-mono border-2 border-violet-400"
						style={{ backgroundColor: color.hex }}
					></div>
				</PopoverTrigger>
				<PopoverContent sideOffset={24} side="left">
					<ColorPicker color={color} onChange={setColor} />
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default PieSerie;
