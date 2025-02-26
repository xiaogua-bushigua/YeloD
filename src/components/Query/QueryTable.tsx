'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transferQuery } from '@/lib/transferQuery';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { useToast } from '@/components/ui/use-toast';
import Dialog from '../Dialog';
import { IQuery } from '@/lib/models';
import { postProcessing } from '@/lib/post-processing';
import { detectDatabaseType } from '@/lib/judgeDatabaseTypes';

import LoadingIcon from '@/components/Icons/LoadingIcon';

const QueryTable = () => {
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [rows, setRows] = useState([] as IQuery[]);
	const [code, setCode] = useState({} as any);
	const [loading, setLoading] = useState(true);
	const [tag, setTag] = useState('');
	const [warningRow, setWarningRow] = useState([] as number[]);
	const { toast } = useToast();
	const headers = ['Database', 'Query', 'Collection/Table', 'Field', 'Query tag', 'Post-Processing', 'Operations'];
	const operations = ['none', 'length', 'sum', 'odd', 'even', 'max', 'min', 'average', 'limit(7)', 'limit(30)'];

	// 获取所有查询语句信息，并设置到rows中
	const fetchData = async () => {
		try {
			const res = await fetch(`/api/dbQueries?username=${user.name || user.username}`, {
				method: 'GET',
			});
			const { queries } = await res.json();
			setRows(queries.queries);
			setLoading(false);
		} catch (error) {
			console.log('Error fetching queries:', error);
		}
	};
	const handleView = async (index: number) => {
		setCode({});
		const uri = rows[index].uri;
		const method = rows[index].method;
		const innerName = rows[index].collectionName || rows[index].tableName;
		const str = rows[index].query;
		let query;
		if (uri.includes('mongodb')) query = transferQuery(str);
		else query = str;
		const param = encodeURIComponent(JSON.stringify({ method, uri, innerName, query }));
		try {
			const res = await fetch(`/api/data?param=${param}`, {
				method: 'GET',
			});
			const { data } = await res.json();
			// 如果表格里field空的，则渲染文档的所有信息；反之，只渲染对应field的信息
			if (!rows[index].field) setCode({ data });
			else {
				let code = data.map((item: any) => item[rows[index].field!]);
				code = postProcessing(code, method);
				setCode({ [rows[index].field!]: code });
				if (rows[index].tag) setTag(rows[index].tag!);
			}
		} catch (error) {
			console.log('Error fetching option data:', error);
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
		let queryBody = {
			uri: rows[index].uri,
			query: rows[index].query,
			field: rows[index].field,
			tag: rows[index].tag,
			username: user.name || user.username,
			index,
			method: rows[index].method,
		} as {
			uri: string;
			query: string;
			field: string;
			tag: string;
			username: string;
			index: number;
			tableName?: string;
			collectionName?: string;
			method: string;
		};
		if (queryBody.uri.includes('mongodb')) queryBody.collectionName = rows[index].collectionName;
		else if (queryBody.uri.includes('mysql')) queryBody.tableName = rows[index].tableName;
		try {
			const res = await fetch('/api/dbTags', {
				method: 'PATCH',
				body: JSON.stringify(queryBody),
			});
			const { status, data } = await res.json();
			if (status === 200) {
				setWarningRow([]);
				toast({
					title: 'Success',
					description: 'The tag has been saved.',
				});
				// 如果有冲突的两行，则保存它们的indexes
			} else if (status === 202) {
				setWarningRow(data);
				toast({
					title: 'Error',
					description: 'The tag has existed!',
				});
			} else {
				toast({
					title: 'Error',
					description: 'Something went wrong. Please try again.',
				});
			}
		} catch (error) {
			console.error('Error saving query:', error);
		}
	};
	const handleDelete = async (index: number) => {
		const res = await fetch('/api/dbTags', {
			method: 'DELETE',
			body: JSON.stringify({
				tag: rows[index].tag,
				username: user.name || user.username,
			}),
		});
		const { status, data } = await res.json();
		if (status === 200) {
			setRows(() => {
				const newRows = [...rows];
				newRows.splice(index, 1);
				return newRows;
			});
			toast({
				title: 'Success',
				description: 'The tag and query have been removed.',
			});
		} else if (status === 202) {
			toast({
				title: 'Suspend',
				description: `The tag has been used in chart [${data}]!`,
			});
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong. Please try again.',
			});
		}
	};
	// 应对表格中field和tag列改变的情况
	const handleInputChange = (index: number, type: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const newRows = [...rows];
		if (type === 'field') newRows[index].field = e.target.value;
		if (type === 'tag') newRows[index].tag = e.target.value;
		setRows(newRows);
	};
	// 应对表格中post-processing列改变的情况
	const handleMethodChange = (index: number, value: string) => {
		const newRows = [...rows];
		newRows[index].method = value;
		setRows(newRows);
	};

	useEffect(() => {
		fetchData();
	}, []);

	// 当code改变时，对代码进行高亮
	useEffect(() => {
		Prism.highlightAll();
	}, [code]);

	return (
		<>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center">
					<LoadingIcon size={72} />
				</div>
			) : (
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
									<span className="font-mono text-slate-800">{detectDatabaseType(row.uri)}</span>
								</TableCell>
								<TableCell>
									<span className="font-mono text-slate-800">{row.query}</span>
								</TableCell>
								<TableCell>
									<span className="font-mono text-slate-800">
										{row.collectionName || row.tableName}
									</span>
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
										className={`${
											warningRow.includes(index) ? 'border-red-700' : ''
										} focus:outline-none active:outline-none`}
										value={row.tag || ''}
										onChange={(e) => handleInputChange(index, 'tag', e)}
									/>
								</TableCell>
								<TableCell>
									<Select
										value={row.method}
										onValueChange={(value) => handleMethodChange(index, value)}
									>
										<SelectTrigger className="w-[140px] font-mono">
											<SelectValue placeholder="Select a method" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{operations.map((operation) => (
													<SelectItem key={operation} value={operation} className="font-mono">
														{operation}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell>
									<div className="flex">
										<Popover modal={true}>
											<PopoverTrigger
												onClick={() => handleView(index)}
												className="mr-4 font-mono font-bold text-zinc-600 hover:text-zinc-900"
											>
												View
											</PopoverTrigger>
											<PopoverContent className="flex flex-col gap-2">
												{tag && (
													<span className="font-mono font-bold text-zinc-800">{tag}</span>
												)}
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
										<Dialog
											content="This action cannot be undone. This will permanently delete this query
												and its tag."
											action={() => handleDelete(index)}
										>
											<span className="ml-4 cursor-pointer font-mono font-bold text-pink-400 hover:text-pink-600">
												Delete
											</span>
										</Dialog>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default QueryTable;
