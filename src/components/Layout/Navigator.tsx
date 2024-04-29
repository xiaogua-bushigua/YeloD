'use client';

import Link from 'next/link';
import React from 'react';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import DatabaseIcon from '../Icons/DatabaseIcon';
import QueriesIcon from '../Icons/QueriesIcon';
import ChartIcon from '../Icons/ChartIcon';
import ScreenIcon from '../Icons/ScreenIcon';
import SettingsIcon from '../Icons/SettingsIcon';

const Navigator = () => {
	const links = [
		{ 
			href: '/data',
			label: 'Data',
			icon: DatabaseIcon,
		},
		{
			href: '/queries',
			label: 'Queries',
			icon: QueriesIcon,
		},
		{
			href: '/charts',
			label: 'Charts',
			icon: ChartIcon,
		},
		{
			href: '/screens',
			label: 'Screens',
			icon: ScreenIcon,
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: SettingsIcon,
		},
	];

	const [hover, setHover] = useState('');
	const pathname = usePathname();

	return (
		<div className="h-screen w-32 bg-gray-50 flex flex-col items-center gap-12 py-3 border border-slate-200">
			<Logo size={24} />

			<ul className="flex flex-col gap-4 w-full">
				{links.map(({ href, label, icon }) => (
					<li key={`${href} ${label}`}>
						<Link
							href={href}
							className={`w-full flex items-center gap-2 font-mono pl-3 py-2 border-l-4 ${
								pathname.split('/')[1] === href.split('/')[1]
									? ' border-violet-700'
									: 'border-transparent'
							}`}
							onMouseEnter={() => setHover(href)}
							onMouseLeave={() => setHover('')}
						>
							{React.createElement(icon, {
								fill:
									hover === href || pathname.split('/')[1] === href.split('/')[1]
										? 'fill-violet-700'
										: 'fill-slate-600',
							})}
							<span
								className={`${
									hover === href || pathname.split('/')[1] === href.split('/')[1]
										? 'text-violet-700'
										: 'text-slate-600'
								} ${pathname.split('/')[1] === href.split('/')[1] ? 'font-bold' : ''} font-mono`}
							>
								{label}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Navigator;
