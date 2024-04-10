'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChartOperations = () => {
	const [chartName, setChartName] = useState('');
	const router = useRouter();
	const handleChartTypeSelectChange = (value: string) => {
		console.log(value);
	};
	const handleChartNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChartName(e.target.value);
	};
	return (
		<div className="flex w-full justify-between">
			<div className="flex w-48">
				<Button onClick={() => router.push('/charts')} variant="outline" size="icon">
					<img src="/imgs/right.svg" alt="left" className="rotate-180 w-6 select-none" />
				</Button>
				<Button
					variant="outline"
					className="font-mono w-1/3 ml-4 h-10 text-white hover:text-white bg-violet-400 hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
				>
					Save
				</Button>
				<Button
					variant="outline"
					className="font-mono w-1/3 ml-4 h-10 text-white hover:text-white bg-pink-400 hover:bg-pink-500 active:ring active:ring-pink-200 active:bg-pink-500"
				>
					Run
				</Button>
			</div>
			<div className="flex gap-2 ">
				<Input
					type="text"
					placeholder="Give a name for your chart"
					className="focus:outline-none active:outline-none"
					value={chartName}
					onChange={(e) => handleChartNameChange(e)}
				/>
				<Select onValueChange={(value) => handleChartTypeSelectChange(value)}>
					<SelectTrigger className="w-[240px] font-mono">
						<SelectValue placeholder="Select a type" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel className="font-mono">Chart types</SelectLabel>
							<SelectItem className="font-mono" value="line">
								Line
							</SelectItem>
							<SelectItem className="font-mono" value="bar">
								Bar
							</SelectItem>
							<SelectItem className="font-mono" value="pie">
								Pie
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default ChartOperations;
