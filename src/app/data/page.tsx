'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { saveDbLinks, fetchDatabaseInfo } from '@/store/reducers/dbSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import LoadingIcon from '@/components/Icons/LoadingIcon';

export default function Data() {
	const router = useRouter();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { info } = useAppSelector((state: RootState) => state.db);
	const dispatch = useAppDispatch();
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();
	const [loading, setLoading] = useState(true);

	const getLinks = async () => {
		const username = encodeURIComponent(JSON.stringify({ username: user.name || user.username }));
		try {
			const res = await fetch(`/api/dbLinks?username=${username}`, {
				method: 'GET'
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
		// router.push('/data/databases');
	}, [user]);

	useEffect(() => {
		setLoading(Boolean(info.length));
	}, [info]);
	return <div className="w-full h-full flex items-center justify-center">{loading && <LoadingIcon size={72} />}</div>;
}
