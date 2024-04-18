'use client';

import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	useEffect(() => {
		console.log('layout wrapper');
	}, []);
	if (pathname === '/login') {
		return children;
	}
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
