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
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { changeChartName, changeChartType, changeUpdateMode } from '@/store/reducers/chartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import PubSub from 'pubsub-js';

const ChartOperations = ({
	chartName,
	chartType,
	updateMode,
}: {
	chartName: string;
	chartType: string;
	updateMode: string;
}) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();
	const { optionData } = useAppSelector((state: RootState) => state.chart);

	const handleChartTypeSelectChange = (value: string) => {
		dispatch(changeChartType(value));
	};
	const handleChartNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(changeChartName(e.target.value));
	};
	const handleChangeUpdateMode = (checked: boolean) => {
		if (!optionData.length) {
			toast({
				title: 'Error',
				description: 'You should fill the option data first.',
			});
			return;
		}
		dispatch(changeUpdateMode(checked ? 'dynamic' : 'static'));
	};
	// 点击保存时发布生成图表缩略图的指令
	const handleClickSave = () => {
		PubSub.publish('saveChartThumbnail', {
			updateMode,
		});
	};

	return (
		<div className="flex w-full justify-between">
			<div className="flex w-2/3 gap-4">
				<Button onClick={() => router.push('/charts')} variant="outline" size="icon">
					<img src="/imgs/right.svg" alt="left" className="rotate-180 w-6 select-none" />
				</Button>
				<Button
					onClick={handleClickSave}
					variant="outline"
					className="font-mono h-10 text-white hover:text-white bg-violet-400 hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
				>
					Save
				</Button>
				<Input
					type="text"
					placeholder="Give a name for the chart"
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
			<div className="flex w-1/3 gap-4 items-center justify-between pl-2">
				<div className="h-full flex items-center font-mono">
					<Switch
						checked={updateMode === 'dynamic'}
						onCheckedChange={(checked) => handleChangeUpdateMode(checked)}
					/>
					<span className="mx-2 w-[140px]">
						{updateMode === 'dynamic' ? 'Dynamic Update' : 'Static Update'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChartOperations;
