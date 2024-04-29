import Image from 'next/image';

const ChartCard = ({ title, cover, onClick }: { title: string; cover: string; onClick: () => void }) => {
	return (
		<div onClick={onClick} className="w-56 h-52 flex flex-col gap-2 cursor-pointer bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-lg">
			<h1 className="font-mono font-bold">{title}</h1>
			<hr className="border-slate-200" />
			<div className="w-full h-full flex-1 relative">
				<Image src={cover} alt="cover" className="object-contain" fill />
			</div>
		</div>
	);
};

export default ChartCard;
