"use client";
import ScreenOperations from '@/components/Screen/ScreenOperations';
import Screen from '@/components/Screen/Screen';

const page = () => {
	return (
		<div className="w-full h-full overflow-hidden flex flex-col gap-4">
			<ScreenOperations />
			<Screen />
		</div>
	);
};

export default page;
