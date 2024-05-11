'use client';

import { useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import DatabaseCard from '@/components/Data/DatabaseCard';
import { ICardsInfo } from '@/app/data/databases/page';

const Page = () => {
	const { info, databaseIndex } = useAppSelector((state: RootState) => state.db);
	const [cardsInfo, setCardsInfo] = useState([] as Array<ICardsInfo>);

	useEffect(() => {
		if (databaseIndex !== undefined) {
			const databaseInfo = info[databaseIndex];
			const newCardsInfo = databaseInfo.collections.map((collection) => ({
				name: collection.name,
				size: collection.options.storageSize,
				count: collection.options.count,
			}));
			setCardsInfo(newCardsInfo);
		}
	}, [info, databaseIndex]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
			{cardsInfo.map((i, index) => (
				<DatabaseCard key={i.name} info={i} index={index} content="documents" />
			))}
		</div>
	);
};

export default Page;
