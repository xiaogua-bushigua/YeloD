'use client';

import React, { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import DatabaseCard from '@/components/DatabaseCard';
import { ICardsInfo } from '@/app/data/databases/page';

const page = () => {
	const { info, databaseIndex } = useSelector((state: RootState) => state.db);
	const [cardsInfo, setCardsInfo] = useState([] as Array<ICardsInfo>);
	useEffect(() => {
		setCardsInfo([]);
		info[databaseIndex!].collections.forEach((collection) => {
			setCardsInfo((prev) => [
				...prev,
				{
					name: collection.name,
					size: collection.options.storageSize,
					count: collection.options.count,
				},
			]);
		});
	}, []);
	return (
		<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
			{cardsInfo.map((i, index) => (
				<DatabaseCard key={i.name} info={i} index={index} content="documents" />
			))}
		</div>
	);
};

export default page;
