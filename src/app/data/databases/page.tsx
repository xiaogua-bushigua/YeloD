'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import DatabaseCard from '@/components/DatabaseCard';
import { useDispatch } from 'react-redux';
import { fetchDatabaseInfo } from '@/store/reducers/dbSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';

const page = () => {
	const { database } = useSelector((state: RootState) => state.db);
  const dispatch: ThunkDispatch<RootState, any, any> = useDispatch();
  useEffect(() => {
    if (!(database.length === 1 && database[0] === '')) {
      dispatch(fetchDatabaseInfo(database));
    }
  }, [database])
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
				database.map((db) => <DatabaseCard key={db} link={db} />)
			)}
		</div>
	);
};

export default page;
