'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import DrawerContentUI from './DrawerContentUI';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFullScreen, setScreenName } from '@/store/reducers/screenSlice';
import html2canvas from 'html2canvas';
import { RootState } from '@/store/store';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const ScreenOperations = () => {
	const { screenName, background, title, ratio, staticInterval, dynamicInterval, charts } = useAppSelector(
		(state: RootState) => state.screen
	);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	const handleFullScreenClick = () => {
		dispatch(setFullScreen(true));
	};
	const handleSaveClick = async () => {
		if (!screenName) {
			toast({
				title: 'Error',
				description: 'The screen should have a name.',
			});
			return;
		}
		if (charts.filter((chart) => chart.checked).length === 0) {
			toast({
				title: 'Error',
				description: 'The screen should charts selected.',
			});
			return;
		}
		const element = document.getElementById('yeloD') as HTMLElement;
		try {
			const canvas = await html2canvas(element);
			const base64Image = canvas.toDataURL();
			const chartsInfo = charts
				.filter((chart) => chart.checked)
				.map((chart) => ({
					chartId: chart._id,
					geometry: {
						left: chart.left,
						top: chart.top,
						width: chart.width,
						height: chart.height,
					},
				}));
			const screenInfo = {
				screenName,
				background,
				title,
				ratio,
				staticInterval,
				dynamicInterval,
				chartsInfo,
				screenImg: base64Image,
			};
			const id = searchParams.get('id');
			const res = await fetch('/api/screen', {
				method: 'PATCH',
				body: JSON.stringify({ screenInfo, username: user.name || user.username, id }),
			});
			const { status } = await res.json();
			if (status === 200) {
				toast({
					title: 'Success',
					description: 'The screen has been saved.',
				});
				router.push('/screens');
			} else {
				toast({
					title: 'Error',
					description: 'Something went wrong. Please try again.',
				});
			}
		} catch (error) {
			console.error('Error occurred during screen image capture:', error);
		}
	};

	return (
		<div className="w-full flex items-center justify-between mt-1">
			<div className="flex items-center">
				<Button onClick={() => router.push('/screens')} variant="outline" size="icon">
					<img src="/imgs/right.svg" alt="left" className="rotate-180 w-6 select-none" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="bg-violet-400 px-2 ml-4 w-16 text-white hover:text-white font-mono hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
					onClick={handleSaveClick}
				>
					Save
				</Button>
				<Input
					type="text"
					placeholder="Give a name for the screen"
					className="focus:outline-none active:outline-none w-72 ml-4"
					value={screenName}
					onChange={(e) => dispatch(setScreenName(e.target.value))}
				/>
			</div>
			<div className="flex items-center justify-center w-48">
				<Button
					variant="outline"
					size="icon"
					className="bg-violet-400 hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
					onClick={handleFullScreenClick}
				>
					<img src="/imgs/fullScreen.svg" alt="left" className="rotate-180 w-6 select-none" />
				</Button>
				<Drawer>
					<DrawerTrigger className="rounded-md px-2 font-mono ml-4 h-10 text-white hover:text-white bg-pink-400 hover:bg-pink-500 active:ring active:ring-pink-200 active:bg-pink-500">
						Configurations
					</DrawerTrigger>
					<DrawerContent className="shadcn-drawer h-1/2">
						<DrawerContentUI />
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

export default ScreenOperations;
