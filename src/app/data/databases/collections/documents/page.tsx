'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import Input from '@/components/Input';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { transferQuery } from '@/lib/transferQuery';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Page = () => {
	const { info, databaseIndex, InnerIndex, database } = useAppSelector((state: RootState) => state.db);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [code, setCode] = useState({ data: [] } as { data: any[] });
	const childRef = useRef<HTMLInputElement | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		Prism.highlightAll();
	}, [code]);

	const handleSearch = async () => {
		const uri = database[databaseIndex];
		const collectionName = info[databaseIndex].collections![InnerIndex].name;
		const str = childRef.current?.value;
		const query = transferQuery(str);
		try {
			const res = await fetch('/api/dbQuery', {
				method: 'POST',
				body: JSON.stringify({ uri, collectionName, query }),
			});
			const { data } = await res.json();
			setCode({ data });
		} catch (error) {
			console.log('Error searching query:', error);
		}
	};

	const handleSaveQuery = async () => {
		const query = childRef.current?.value;
		const queryObj = {
			uri: database[databaseIndex],
			collectionName: info[databaseIndex].collections![InnerIndex].name,
			query,
		};
		const username = user?.name || user?.username;
		try {
			const res = await fetch('/api/dbQuery', {
				method: 'PATCH',
				body: JSON.stringify({ queryObj, username }),
			});
			const { status } = await res.json();
			const description =
				status === 200 ? 'The query has been saved.' : 'Something went wrong. Please try again.';
			toast({
				title: 'Success',
				description,
			});
		} catch (error) {
			console.log('Error saving query:', error);
		}
	};

	return (
		<div className="mt-4 flex flex-col">
			<div className="flex flex-col items-start justify-between px-4 mb-4">
				<div className="flex items-center justify-between w-full">
					<div className="flex w-4/5 items-center">
						<Input
							ref={childRef}
							title="query"
							name="queries"
							type="type"
							placeholder='such as: .find({ "age": { "$gt": 60 } }).sort({ "age": 1 }).limit(10)'
							className="bg-neutral-50 w-full font-mono border border-violet-200"
						/>
						<Button
							variant="outline"
							onClick={handleSearch}
							className="font-mono w-24 ml-4 h-10 text-white hover:text-white bg-violet-400 hover:bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-500"
						>
							Search
						</Button>
						<Button
							variant="outline"
							onClick={handleSaveQuery}
							className="font-mono w-24 ml-4 h-10 text-white hover:text-white bg-pink-400 hover:bg-pink-500 active:ring active:ring-pink-200 active:bg-pink-500"
						>
							Save
						</Button>
					</div>
					<span className="font-mono text-slate-500">{code.data.length + ' documents'}</span>
				</div>
			</div>
			<pre className="shadow-md border-2 border-t-slate-200 border-indigo-50 rounded-lg h-[calc(100vh-194px)]">
				<code className="language-js">{JSON.stringify(code, null, 2)}</code>
			</pre>
		</div>
	);
};

export default Page;
