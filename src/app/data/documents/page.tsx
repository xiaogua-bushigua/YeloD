'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { transferQuery } from '@/utils/transferQuery';

const page = () => {
	const { info, databaseIndex, collectionIndex, database } = useSelector((state: RootState) => state.db);
	const { user } = useSelector((state: RootState) => state.auth);
	const [path, setPath] = useState('' as string);
	const [code, setCode] = useState({ data: [] } as { data: any[] });
	const childRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const databaseName = info[databaseIndex].dbStats.db;
		const collectionName = info[databaseIndex].collections[collectionIndex].name;
		setPath(`${databaseName} / ${collectionName}`);
	}, []);

	useEffect(() => {
		Prism.highlightAll();
	}, [code]);

	const handleSearch = async () => {
		const uri = database[databaseIndex];
		const collectionName = info[databaseIndex].collections[collectionIndex].name;
		const str = childRef.current?.value;
		const query = transferQuery(str);
		const res = await fetch('/api/dbQuery', {
			method: 'POST',
			body: JSON.stringify({ uri, collectionName, query }),
		});
		const { data } = await res.json();
		setCode({ data });
	};

	const handleSaveQuery = async () => {
		const query = childRef.current?.value;
		const queryObj = {
			uri: database[databaseIndex],
			collectionName: info[databaseIndex].collections[collectionIndex].name,
			query,
		};
		const username = user?.name || user?.username;
		const res = await fetch('/api/dbQuery', {
			method: 'PATCH',
			body: JSON.stringify({ queryObj, username }),
		});
	};

	return (
		<div className="mt-4 flex flex-col">
			<div className="flex flex-col items-start justify-between px-4 mb-2">
				<span className="font-mono text-violet-600 mb-2">{'path: ' + path}</span>
				<div className="flex items-center justify-between w-full">
					<div className="flex w-4/5 items-center">
						<Input
							ref={childRef}
							title="queries"
							name="queries"
							type="type"
							placeholder='such as: .find({ "age": { "$gt": 60 } }).sort({ "age": 1 }).limit(10)'
							className="bg-neutral-50 w-full font-mono border border-violet-200"
						/>
						<Button onClick={handleSearch} text="search" className="w-1/6 ml-4 h-10 bg-violet-500" />
						<Button
							onClick={handleSaveQuery}
							text="save"
							className="w-1/6 ml-4 h-10 bg-pink-400 focus:ring focus:ring-pink-200 active:bg-pink-500"
						/>
					</div>
					<span className="font-mono text-slate-500">{code.data.length + ' documents'}</span>
				</div>
			</div>
			<pre className="shadow-md border-2 border-t-slate-200 border-indigo-50">
				<code className="language-js">{JSON.stringify(code, null, 2)}</code>
			</pre>
		</div>
	);
};

export default page;
