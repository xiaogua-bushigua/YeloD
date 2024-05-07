'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { saveDbLinks, fetchDatabaseInfo } from '@/store/reducers/dbSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';

export default function Data() {
	const router = useRouter();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const dispatch = useAppDispatch();
	const dispatchAsync: ThunkDispatch<RootState, any, any> = useDispatch();

	const getLinks = async () => {
		const res = await fetch('/api/dbLinks', {
			method: 'POST',
			body: JSON.stringify({ username: user.name || user.username }),
		});
		const { data } = await res.json();
    if(data.length === 1 && data[0] === '') return;
		dispatch(saveDbLinks(data));
		dispatchAsync(fetchDatabaseInfo(data));
	};

	useEffect(() => {
		getLinks();
		router.push('/data/databases');
	}, [user]);
	return <div></div>;
}
