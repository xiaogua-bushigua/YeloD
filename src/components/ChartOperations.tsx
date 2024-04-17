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
import { useRouter } from 'next/navigation';
import { changeChartName, changeChartType, setOption } from '@/store/reducers/chartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';

interface Props {
	chartName: string;
	chartType: string;
}

const ChartOperations = ({ chartName, chartType }: Props) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();

	const { tempOption } = useAppSelector((state: RootState) => state.chart);
	const handleChartTypeSelectChange = (value: string) => {
		dispatch(changeChartType(value));
	};
	const handleChartNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(changeChartName(e.target.value));
	};
	const handleClickRun = () => {
		try {
			const options = JSON.parse(tempOption);
			dispatch(setOption(options));
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Options must be valid JSON format.',
			});
		}
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
					onClick={handleClickRun}
					className="font-mono w-1/3 ml-4 h-10 text-white hover:text-white bg-pink-400 hover:bg-pink-500 active:ring active:ring-pink-200 active:bg-pink-500"
				>
					Run
				</Button>
			</div>
			<div className="flex w-1/2 gap-4 mt-1 items-center pl-2">
				<Input
					type="text"
					placeholder="Give a name for your chart"
					className="focus:outline-none active:outline-none w-36"
					value={chartName}
					onChange={(e) => handleChartNameChange(e)}
				/>
				<Select value={chartType} onValueChange={(value) => handleChartTypeSelectChange(value)}>
					<SelectTrigger className="font-mono w-36">
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
