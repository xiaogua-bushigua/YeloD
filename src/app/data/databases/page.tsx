'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import DatabaseCard from '@/components/DatabaseCard';

export interface ICardsInfo {
	name: string;
	size: number;
	count: number;
}

const page = () => {
	const { database } = useSelector((state: RootState) => state.db);
	const { info } = useSelector((state: RootState) => state.db);
	const [cardsInfo, setCardsInfo] = useState([] as Array<ICardsInfo>);

	useEffect(() => {
		const newCardsInfo = info.map((i) => ({
			name: i.dbStats.db,
			size: i.dbStats.storageSize,
			count: i.collections.length,
		}));
		setCardsInfo(newCardsInfo);
	}, [info]);

	return (
		<div>
			{database.length === 1 && database[0] === '' ? (
				<span className="font-mono py-12 block text-slate-700">
					{'⚠️ There is no database links, please go to '}
					<Link className="text-violet-500 font-mono font-bold decoration-2 underline" href="/settings">
						{'settings'}
					</Link>{' '}
					and set them first.
				</span>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
					{cardsInfo.map((i, index) => (
						<DatabaseCard key={i.name} info={i} index={index} content="collections" />
					))}
				</div>
			)}
		</div>
	);
};

export default page;
