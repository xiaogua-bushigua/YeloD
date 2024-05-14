import ChartCheck from './ChartCheck';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import React, { useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/store/hooks';
import { setBackground, initCharts, setTitle, setRatio, setRefreshInterval } from '@/store/reducers/screenSlice';
import { Input } from '@/components/ui/input';

const DrawerContentUI = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { background, charts, title, ratio, staticInterval, dynamicInterval } = useAppSelector(
		(state: RootState) => state.screen
	);

	const fetchData = async () => {
    // 初始化抽屉里待勾选的图表
		const res = await fetch(`/api/chart?username=${user.name || user.username}`, {
			method: 'GET',
		});
		const { data } = await res.json();
		dispatch(initCharts(data));
	};

	useEffect(() => {
		fetchData()
	}, []);
	return (
		<div className="w-full h-full flex">
			<div className="w-64 border-r flex flex-col border-slate-300 p-4">
				<div className="flex gap-2 items-center my-2">
					<span className="text-sm font-mono inline-block w-[160px] text-end">Background</span>
					<Select value={background} onValueChange={(value) => dispatch(setBackground(value))}>
						<SelectTrigger className="pl-4 font-mono">
							<SelectValue className="pl-4 font-mono" placeholder="Select background" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup className="font-mono">
								<SelectLabel>Backgrounds</SelectLabel>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex gap-2 items-center my-2">
					<span className="text-sm font-mono w-[160px] text-end">Title</span>
					<Input
						type="text"
						value={title}
						onChange={(e) => dispatch(setTitle(e.target.value))}
						placeholder="Type the title"
						className="focus:outline-none active:outline-none"
					/>
				</div>
				<div className="flex gap-2 items-center my-2">
					<span className="text-sm font-mono inline-block w-[160px] text-end">Ratio</span>
					<Select value={ratio} onValueChange={(value) => dispatch(setRatio(value))}>
						<SelectTrigger className="pl-4 font-mono">
							<SelectValue className="pl-4 font-mono" placeholder="Select a Ratio" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup className="font-mono">
								<SelectLabel>Ratios</SelectLabel>
								<SelectItem value="1:1">1:1</SelectItem>
								<SelectItem value="16:9">16:9</SelectItem>
								<SelectItem value="144:90">144:90</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex gap-2 items-center my-2">
					<span className="text-sm font-mono w-[160px] text-end">Static Interval</span>
					<Input
						type="text"
						value={staticInterval}
						onChange={(e) => dispatch(setRefreshInterval({ type: 'static', interval: e.target.value }))}
						placeholder="minutes"
						className="focus:outline-none active:outline-none"
					/>
				</div>
				<div className="flex gap-2 items-center my-2">
					<span className="text-sm font-mono w-[160px] text-end">Dynamic Interval</span>
					<Input
						type="text"
						value={dynamicInterval}
						onChange={(e) => dispatch(setRefreshInterval({ type: 'dynamic', interval: e.target.value }))}
						placeholder="seconds"
						className="focus:outline-none active:outline-none"
					/>
				</div>
			</div>
			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-y-8">
				{charts.map((card) => (
					<ChartCheck key={card._id} info={card} />
				))}
			</div>
		</div>
	);
};

export default DrawerContentUI;
