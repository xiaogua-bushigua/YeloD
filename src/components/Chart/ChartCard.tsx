'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Dialog from '../Dialog';

const ChartCard = ({
	title,
	cover,
	onClick,
	onDeleteClick,
}: {
	title: string;
	cover: string;
	onClick: () => void;
	onDeleteClick: () => void;
}) => {
	const [hover, setHover] = useState(false);
	return (
		<div
			className="w-56 h-52 flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-lg"
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className="flex justify-between items-center relative">
				<h1 className="font-mono font-bold h-8">{title}</h1>
				<Dialog
					content={`This action cannot be undone. This will permanently delete [${title}].`}
					action={onDeleteClick}
				>
					<Image
						src={'/imgs/delete1.svg'}
						alt="delete"
						className={`object-contain  ${hover ? 'block' : 'hidden'}`}
						width={30}
						height={30}
					/>
				</Dialog>
			</div>
			<hr className="border-slate-200" />
			<div className="w-full h-full flex-1 relative cursor-pointer" onClick={onClick}>
				<Image src={cover} alt="cover" className="object-contain" fill />
			</div>
		</div>
	);
};

export default ChartCard;
