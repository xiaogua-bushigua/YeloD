'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setDatabaseIndex, setInnerIndex } from '@/store/reducers/dbSlice';
import { ICardsInfo } from '@/app/data/page';

interface Props {
	info: ICardsInfo;
	content: string;
	index: number;
}

const DatabaseCard = ({ info, content, index }: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const handleClick = () => {
		// 如果card内有collections或者documents的时候才允许点进去
		if (info.count) {
			switch (content) {
				case 'collections':
					router.push('/data/databases/collections');
					dispatch(setDatabaseIndex(index));
					break;
				case 'documents':
					router.push('/data/databases/collections/documents');
					dispatch(setInnerIndex(index));
					break;
				case 'tables':
					router.push('/data/databases/tables');
					dispatch(setDatabaseIndex(index));
					break;
				case 'rows':
					router.push('/data/databases/tables/rows');
					dispatch(setInnerIndex(index));
					break;
				default:
					break;
			}
		}
	};
	const getSize = (size: number, type: string) => {
		let s = type === 'mongodb' ? size / 1024 / 1024 : size;
		if (Number(s) < 1) {
			return (Number(s) * 1024).toFixed(1) + ' KB';
		} else {
			return Number(s).toFixed(1) + ' MB';
		}
	};
	return (
		<div
			className="min-h-36 flex justify-between gap-2 rounded-md shadow-md border-violet-200 border-2 p-4 bg-slate-50 hover:shadow-xl hover:border-violet-400 cursor-pointer"
			onClick={handleClick}
		>
			<div className="flex flex-col justify-around">
				{info.name && <h3 className="font-mono font-bold text-slate-700 text-xl">{info.name}</h3>}
				{!info.name && <h3 className="font-mono font-bold text-red-700 text-xl">connection error</h3>}
				<p>
					<span className="text-xl text-violet-700 font-bold">{info.count}</span>
					<span className="font-mono text-slate-400 ml-2">{content}</span>
				</p>
			</div>
			<div className="min-w-20 flex flex-col items-center justify-between">
				<Image
					src={info.type === 'mongodb' ? '/imgs/mongodb.png' : '/imgs/mysql.png'}
					alt="mongodb"
					width={72}
					height={72}
				/>
				<span className="font-mono text-slate-700">{getSize(info.size, info.type)}</span>
			</div>
		</div>
	);
};

export default DatabaseCard;
