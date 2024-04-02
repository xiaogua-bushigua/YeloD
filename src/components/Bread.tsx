'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
	breads: {
		name: string;
		path: string;
	}[];
}

const Bread = ({ breads }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	// 当前路由导航级别
	const [level, setLevel] = useState(0);

	useEffect(() => {
		setLevel(breads.findIndex((bread) => '/data' + bread.path === pathname));
	}, [pathname]);

	const handleClick = (path: string) => {
		router.push('/data' + path);
	};

	return (
		<div className="flex gap-2 items-center">
			{breads.slice(0, level + 1).map((bread, index) => (
				<span className="flex gap-2 items-center" key={bread.name}>
					<span
						onClick={() => handleClick(bread.path)}
						className={`font-mono cursor-pointer ${index === level ? 'text-violet-500' : 'text-slate-700'}`}
					>
						{bread.name}
					</span>
					{index < level && <Image src="/imgs/right.svg" alt="bread" width={16} height={16} />}
				</span>
			))}
		</div>
	);
};

export default Bread;
