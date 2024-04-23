'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import DrawerContentUI from './DrawerContentUI';
import { useRouter } from 'next/navigation';

const ScreenOperations = ({ screenRef }: { screenRef: HTMLDivElement }) => {
	const router = useRouter();
	const handleFullScreenClick = () => {
		screenRef.requestFullscreen();
	};
	return (
		<div className="w-full flex items-center justify-between mt-1">
			<div className='flex items-center'>
				<Button onClick={() => router.push('/screens')} variant="outline" size="icon">
					<img src="/imgs/right.svg" alt="left" className="rotate-180 w-6 select-none" />
				</Button>
				<Input
					type="text"
					placeholder="Give a name for the screen"
					className="focus:outline-none active:outline-none w-72 ml-4"
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
