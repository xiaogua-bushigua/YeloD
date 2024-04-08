'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transferQuery } from '@/lib/transferQuery';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { useToast } from '@/components/ui/use-toast';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Itags {
	_id: string;
	uri: string;
	collectionName: string;
	query: string;
	field?: string;
	tag?: string;
}

const QueryTable = () => {
	const headers = ['Database uri', 'Query', 'Collection', 'Field', 'Query tag', 'Operations'];
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [rows, setRows] = useState([] as Itags[]);
	const [code, setCode] = useState({} as any);
	const [tag, setTag] = useState('');
	const { toast } = useToast();

	const fetchData = async () => {
		const res = await fetch(`/api/dbQuery?username=${user.name || user.username}`, {
			method: 'GET',
		});
		const { queries } = await res.json();
		setRows(queries.queries);
	};

	const handleView = async (index: number) => {
		const uri = rows[index].uri;
		const collectionName = rows[index].collectionName;
		const str = rows[index].query;
		const query = transferQuery(str);
		const res = await fetch('/api/dbQuery', {
			method: 'POST',
			body: JSON.stringify({ uri, collectionName, query }),
		});
		const { data } = await res.json();
		if (!rows[index].field) setCode({ data });
		else {
			const code = data.map((item: any) => item[rows[index].field!]);
			setCode({ [rows[index].field!]: code });
			if (rows[index].tag) setTag(rows[index].tag!);
		}
	};
	const handleSave = async (index: number) => {
		if (!rows[index].field || !rows[index].tag) {
			toast({
				title: 'Error',
				description: 'Field and tag are required.',
			});
			return;
		}
		const queryBody = {
			uri: rows[index].uri,
			collectionName: rows[index].collectionName,
			query: rows[index].query,
			field: rows[index].field,
			tag: rows[index].tag,
			username: user.name || user.username,
		};
		const res = await fetch('/api/dbTags', {
			method: 'PATCH',
			body: JSON.stringify(queryBody),
		});
		const { status } = await res.json();
		const description = status === 200 ? 'The tag has been saved.' : 'Something went wrong. Please try again.';
		toast({
			description,
		});
	};
	const handleDelete = async (index: number) => {
		setRows(() => {
			const newRows = [...rows];
			newRows.splice(index, 1);
			const queryBody = {
				rows: newRows,
				username: user.name || user.username,
			};
			fetch('/api/dbTags', {
				method: 'DELETE',
				body: JSON.stringify(queryBody),
			})
				.then(() => {
					toast({
						description: 'The tag and query have been removed.',
					});
				})
				.catch((error) => {
					console.error('Error:', error);
					toast({
						description: 'Something went wrong. Please try again.',
					});
				});
			return newRows;
		});
	};

	const handleInputChange = (index: number, type: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const newRows = [...rows];
		if (type === 'field') newRows[index].field = e.target.value;
		if (type === 'tag') newRows[index].tag = e.target.value;
		setRows(newRows);
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		Prism.highlightAll();
	}, [code]);

	return (
		<Table className="bg-white rounded-md">
			<TableHeader>
				<TableRow>
					{headers.map((header) => (
						<TableHead key={header}>{header}</TableHead>
					))}
				</TableRow>
			</TableHeader>

			<TableBody>
				{rows.map((row, index) => (
					<TableRow key={row._id}>
						<TableCell>
							<span className="font-mono text-slate-800">{row.uri}</span>
						</TableCell>
						<TableCell>
							<span className="font-mono text-slate-800">{row.query}</span>
						</TableCell>
						<TableCell>
							<span className="font-mono text-slate-800">{row.collectionName}</span>
						</TableCell>
						<TableCell>
							<Input
								type="text"
								placeholder=""
								className="focus:outline-none active:outline-none"
								value={row.field || ''}
								onChange={(e) => handleInputChange(index, 'field', e)}
							/>
						</TableCell>
						<TableCell>
							<Input
								type="text"
								placeholder=""
								className="focus:outline-none active:outline-none"
								value={row.tag || ''}
								onChange={(e) => handleInputChange(index, 'tag', e)}
							/>
						</TableCell>
						<TableCell>
							<div className="flex">
								<Popover>
									<PopoverTrigger
										onClick={() => handleView(index)}
										className="mr-4 font-mono font-bold text-zinc-600 hover:text-zinc-900"
									>
										View
									</PopoverTrigger>
									<PopoverContent>
										{tag && <span className="font-mono font-bold text-zinc-800">{tag}</span>}
										<pre className="shadow-md border-2 border-t-slate-200 border-indigo-50 rounded-lg max-h-64">
											<code className="language-js">{JSON.stringify(code, null, 2)}</code>
										</pre>
									</PopoverContent>
								</Popover>
								<span
									onClick={() => handleSave(index)}
									className="cursor-pointer font-mono font-bold text-violet-400 hover:text-violet-700"
								>
									Save
								</span>
								<AlertDialog>
									<AlertDialogTrigger>
										<span className="ml-4 cursor-pointer font-mono font-bold text-pink-400 hover:text-pink-600">
											Delete
										</span>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this query
												and its tag.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="text-slate-50 bg-violet-700 hover:bg-violet-500"
												onClick={() => handleDelete(index)}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default QueryTable;
