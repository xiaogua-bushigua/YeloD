'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const page = () => {
	const { info, databaseIndex, collectionIndex, database } = useSelector((state: RootState) => state.db);
	const [path, setPath] = useState('' as string);
	const [code, setCode] = useState({} as any);
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
		const query = childRef.current?.value;
		const uri = database[databaseIndex];
		const collectionName = info[databaseIndex].collections[collectionIndex].name;
		const res = await fetch('/api/dbQuery', {
			method: 'POST',
			body: JSON.stringify({ uri, collectionName, query }),
		});
		const { data } = await res.json();
		setCode({ data });
	};

	return (
		<div className="mt-4 flex flex-col">
			<div className="flex items-center justify-between px-4 mb-2">
				<div className="flex w-1/2 items-center">
					<Input
						ref={childRef}
						title="queries"
						name="queries"
						type="type"
						placeholder="input queries"
						className="bg-neutral-50 w-full font-mono border border-violet-200"
					/>
					<Button onClick={handleSearch} text="search" className="w-1/5 ml-4 h-10 bg-violet-500" />
				</div>
				<span className="font-mono text-slate-700">{path}</span>
			</div>
			<pre className="shadow-md border-2 border-t-slate-200 border-indigo-50">
				<code className="language-js">{JSON.stringify(code, null, 2)}</code>
			</pre>
		</div>
	);
};

export default page;
