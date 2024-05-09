'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

const Label = () => {
	const [color, setColor] = useColor('#561ecb');

	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Label</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">show: </span>
				<Switch />
			</div>
			<div className="flex pl-4 my-2 items-center">
				<span className="font-mono mr-4 w-24 text-sm">position: </span>
				<Carousel>
					<CarouselContent>
						<CarouselItem>1</CarouselItem>
						<CarouselItem>2</CarouselItem>
						<CarouselItem>3</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">size: </span>
				<Slider defaultValue={[16]} max={30} min={12} step={1} />
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-[60px] text-sm">color: </span>
				<Popover>
					<PopoverTrigger>
						<div className="w-10 h-5 rounded-md" style={{ backgroundColor: color.hex }}></div>
					</PopoverTrigger>
					<PopoverContent sideOffset={24} side="left">
						<ColorPicker color={color} onChange={setColor} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default Label;
