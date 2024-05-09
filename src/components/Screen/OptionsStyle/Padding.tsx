import React from 'react'
import { Slider } from '@/components/ui/slider';

const Padding = () => {
  return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Padding</p>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">left: </span>
				<Slider defaultValue={[30]} max={50} step={1} />
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">right: </span>
				<Slider defaultValue={[30]} max={50} step={1} />
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">bottom: </span>
				<Slider defaultValue={[30]} max={50} step={1} />
			</div>
			<div className="flex pl-4 my-1 items-center">
				<span className="font-mono mr-4 w-24 text-sm">top: </span>
				<Slider defaultValue={[30]} max={50} step={1} />
			</div>
		</div>
  );
}

export default Padding
