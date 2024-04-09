import Image from 'next/image';
import React from 'react';

const ChartCard = ({ title, cover }: { title: string; cover: string }) => {
	return (
		<div className="flex flex-col gap-2 w-48 h-48 cursor-pointer bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-lg">
			<h1 className="font-mono font-bold">{title}</h1>
			<hr className="border-slate-200" />
			<div className="w-full h-full flex-1 relative">
				<Image src={cover} alt="cover" className="object-contain" fill />
			</div>
		</div>
	);
};

export default ChartCard;
