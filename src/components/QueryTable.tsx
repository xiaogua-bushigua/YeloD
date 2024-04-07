'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

interface Itags {
  _id: string;
  uri: string;
  collectionName: string;
  query: string;
  field?: string;
  tag?: string;
}

const QueryTable = () => {
	const headers = ['Database uri', 'Query', 'Collection', 'Field', 'Query tag'];
  const { user } = useAppSelector((state: RootState) => state.auth);
	const [rows, setRows] = useState([] as Itags[]);

	const fetchData = async () => {
		const res = await fetch(`/api/dbQuery?username=${user.name || user.username}`, {
			method: 'GET',
		});
		const { queries } = await res.json();
		setRows(queries.queries)
	};

	useEffect(() => {
		fetchData();
	}, []);

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
								// value={row.field}
							/>
						</TableCell>
						<TableCell>
							<Input
								type="text"
								placeholder=""
								className="focus:outline-none active:outline-none"
								// value={row.tag}
							/>
						</TableCell>
						<TableCell>
							<div className="flex">
								<Button
									variant="ghost"
									className="hover:bg-zinc-50 hover:outline hover:outline-violet-100 font-mono font-bold text-violet-500 hover:text-violet-700"
								>
									view
								</Button>
								<Button
									variant="ghost"
									className="hover:bg-zinc-50 hover:outline hover:outline-pink-100 font-mono font-bold text-pink-500 hover:text-pink-700"
								>
									delete
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default QueryTable;
