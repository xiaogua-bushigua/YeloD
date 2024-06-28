'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { saveDbLinks, fetchDatabaseInfo } from '@/store/reducers/dbSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import LoadingIcon from '@/components/Icons/LoadingIcon';
import Link from 'next/link';
import DatabaseCard from '@/components/Data/DatabaseCard';

export interface ICardsInfo {
	name: string;
	size: number;
	count: number;
	type: string;
}

export default function Data() {
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { info, database } = useAppSelector((state: RootState) => state.db);
	const dispatch = useAppDispatch();
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const [loading, setLoading] = useState(true);

	const [cardsInfo, setCardsInfo] = useState([] as Array<ICardsInfo>);

	const getLinks = async () => {
		const username = encodeURIComponent(JSON.stringify({ username: user.name || user.username }));
		try {
			const res = await fetch(`/api/dbLinks?username=${username}`, {
				method: 'GET',
			});
			const { data } = await res.json();
			if (data.length === 1 && data[0] === '') return;
			dispatch(saveDbLinks(data));
			dispatchAsync(fetchDatabaseInfo(data));
		} catch (error) {
			console.error('Error getting links:', error);
		}
	};

	useEffect(() => {
		getLinks();
	}, [user]);

	useEffect(() => {
		setLoading(!Boolean(info.length));
		if (database[0] !== '') {
			const newCardsInfo = info.map((i) => ({
				name: i.dbStats.db,
				size: i.dbStats.storageSize,
				count: i.collections ? i.collections.length : i.tables!.length,
				type: i.type,
			}));
			setCardsInfo(newCardsInfo);
		}
	}, [info]);

	useEffect(() => {}, [info]);
	return (
		<div className="w-full h-full">
			{loading && (
				<div className="w-full h-full flex items-center justify-center">
					<LoadingIcon size={72} />
				</div>
			)}
			{database.length === 1 && database[0] === '' ? (
				<span className="font-mono py-12 block text-slate-700">
					{'⚠️ There is no database links, please go to '}
					<Link className="text-violet-500 font-mono font-bold decoration-2 underline" href="/settings">
						settings
					</Link>{' '}
					and set them first.
				</span>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					{cardsInfo.map((i, index) => (
						<DatabaseCard
							key={i.name + index}
							info={i}
							index={index}
							content={i.type === 'mongodb' ? 'collections' : 'tables'}
						/>
					))}
				</div>
			)}
		</div>
	);
}
