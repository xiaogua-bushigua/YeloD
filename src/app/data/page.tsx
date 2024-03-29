'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { saveDbLinks } from '@/store/reducers/dbSlice';

export default function Data() {
	const router = useRouter();
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch();
	const getLinks = async () => {
		const res = await fetch('/api/dbLinks', {
			method: 'POST',
			body: JSON.stringify({ username: user.name || user.username }),
		});
		const { data } = await res.json();
		dispatch(saveDbLinks(data));
	};

	useEffect(() => {
		getLinks();
		router.push('/data/databases');
	}, []);
	return <div></div>;
}
