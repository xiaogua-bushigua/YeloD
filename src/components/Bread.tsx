'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Bread = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [breads, setBreads] = useState<string[]>([]);

	useEffect(() => {
		setBreads(pathname.split('/').splice(2));
	}, [pathname]);

	const handleClick = (subpath: string) => {
		let path;
		// 检查输入字符串是否包含指定的子字符串
		const index = pathname.indexOf(subpath);
		if (index !== -1) {
			// 找到子字符串后的第一个斜杠的位置
			const nextSlashIndex = pathname.indexOf('/', index + subpath.length);
			if (nextSlashIndex !== -1) {
				// 返回子字符串后的斜杠之前的部分
				path = pathname.substring(0, nextSlashIndex);
			} else {
				// 如果找不到斜杠，直接返回整个输入字符串
				path = pathname;
			}
		} else {
			// 如果输入字符串不包含指定的子字符串，则直接返回整个输入字符串
			path = pathname;
		}
		router.push(path);
	};

	return (
		<div className="flex gap-2 items-center">
			{breads.map((bread, index) => (
					<span className="flex gap-2 items-center" key={bread}>
						<span
							onClick={() => handleClick(bread)}
							className={`font-mono cursor-pointer ${
								index === breads.length - 1 ? 'text-violet-500' : 'text-slate-700'
							}`}
						>
							{bread.toUpperCase().substring(0, 1) + bread.slice(1)}
						</span>
						{index < breads.length - 1 && (
							<Image src="/imgs/right.svg" alt="bread" width={16} height={16} />
						)}
					</span>
				))}
		</div>
	);
};

export default Bread;
