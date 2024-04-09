import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import React from 'react';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-screen h-screen flex">
			<Navigator />
			<div className="flex-1 flex flex-col">
				<Header />
				<div className="overflow-auto flex-1 max-h-full max-w-full bg-gray-100 p-4">{children}</div>
			</div>
		</div>
	);
};

export default LayoutWrapper;
