import ChartCheck from './ChartCheck';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
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
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { setBackground, initCharts } from '@/store/reducers/screenSlice';

const DrawerContentUI = () => {
  const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);
  const { background, charts } = useAppSelector((state: RootState) => state.screen);
	const fetchData = async () => {
		const res = await fetch(`/api/chart?username=${user.name || user.username}`, {
			method: 'GET',
		});
		const { data } = await res.json();
    dispatch(initCharts(data));
	};
  const handleSaveClick = () => {

  }
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<div className="w-full h-full flex">
			<div className="w-60 border-r flex flex-col justify-between border-slate-300 p-4">
				<div className="flex gap-4 items-center">
					<span className="text-sm font-mono">Background</span>
					<Select value={background} onValueChange={(value) => dispatch(setBackground(value))}>
						<SelectTrigger className="pl-4">
							<SelectValue className="pl-4" placeholder="Select background" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Backgrounds</SelectLabel>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex gap-4 items-center mt-4 justify-between">
					<span className="text-sm">12 charts selected</span>
					<Button
						variant="outline"
						size="icon"
						className="bg-violet-400 font-mono px-8 text-white hover:text-white hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
						onClick={handleSaveClick}
					>
						Save
					</Button>
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
