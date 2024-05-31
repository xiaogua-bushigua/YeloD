'use client';

import { useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import Input from '@/components/Input';
import 'prismjs/themes/prism.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SqlSearchTable from '@/components/Data/SqlSearchTable';

const Page = () => {
	const { info, databaseIndex, InnerIndex, database } = useAppSelector((state: RootState) => state.db);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const childRef = useRef<HTMLInputElement | null>(null);
	const { toast } = useToast();
	const [tableData, setTableData] = useState<any[]>([]);

	const handleSaveQuery = async () => {
		const query = childRef.current?.value;
		const queryObj = {
			uri: database[databaseIndex],
			tableName: info[databaseIndex].tables![InnerIndex].name,
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
				title: status === 200 ? 'Success' : 'Error',
				description,
			});
		} catch (error) {
			console.log('Error saving query:', error);
		}
	};

	const handleSearch = async () => {
		const uri = database[databaseIndex];
		const innerName = info[databaseIndex].tables![InnerIndex].name;
		const query = childRef.current?.value;
		try {
			const res = await fetch('/api/dbQuery', {
				method: 'POST',
				body: JSON.stringify({ uri, innerName, query, type: 'mysql' }),
			});
			const { data } = await res.json();
			setTableData(data);
		} catch (error) {
			console.log('Error searching query:', error);
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
							placeholder="such as: WHERE age > 40;"
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
					<span className="font-mono text-slate-500">{tableData.length + ' rows'}</span>
				</div>
			</div>
			<SqlSearchTable data={tableData} />
		</div>
	);
};

export default Page;
