'use client';

import { ICardsInfo } from '@/app/data/databases/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { saveDataPath } from '@/store/reducers/dbSlice';

interface Props {
	info: ICardsInfo;
	content: string;
	index: number;
}

const DatabaseCard = ({ info, content, index }: Props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const handleClick = () => {
    // 如果card内有collections或者documents的时候才允许点进去
		if (info.count) {
			if (content === 'collections') {
				dispatch(
					saveDataPath({
						databaseIndex: index,
					})
				);
			} else {
				dispatch(
					saveDataPath({
						collectionIndex: index,
					})
				);
			}
			router.push('/data/' + content);
		}
	};
	return (
		<div
			className="min-h-36 flex justify-between gap-2 rounded-md shadow-md border-violet-200 border-2 p-4 bg-slate-50 hover:shadow-xl hover:border-violet-400 cursor-pointer"
			onClick={handleClick}
		>
			<div className="flex flex-col items-center justify-around">
				<h3 className="font-mono font-bold text-slate-700 text-xl">{info.name}</h3>
				<p>
					<span className="text-xl text-violet-700 font-bold">{info.count}</span>
					<span className="font-mono text-slate-400 ml-2">{content}</span>
				</p>
			</div>
			<div className="min-w-20 flex flex-col items-center justify-between">
				<Image src={'/imgs/mongodb.png'} alt="mongodb" width={72} height={72} />
				<span className="font-mono text-slate-700">{(info.size / 1000).toFixed(1) + ' KB'}</span>
			</div>
		</div>
	);
};

export default DatabaseCard;
