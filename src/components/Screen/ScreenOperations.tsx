'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const ScreenOperations = ({ screenRef }: { screenRef: HTMLDivElement }) => {
	const handleFullScreenClick = () => {
		screenRef.requestFullscreen();
	};
	return (
		<div className="w-full flex items-center justify-between mt-1">
			<Input
				type="text"
				placeholder="Give a name for the screen"
				className="focus:outline-none active:outline-none w-72"
			/>
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
					<DrawerContent className="h-1/2"></DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

export default ScreenOperations;
