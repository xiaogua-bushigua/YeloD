import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SqlSearchTable = ({ data }: { data: any[] }) => {
	return (
		<div className="h-[calc(100vh-194px)] rounded-md w-full bg-[rgb(245,242,240)] overflow-scroll border border-slate-200 shadow-md">
			<Table className="bg-[rgb(245,242,240)]">
				<TableHeader>
					<TableRow>
						{data[0] &&
							Object.keys(data[0]).map((key) => (
								<TableHead className="font-mono text-slate-800 font-bold text-md" key={key}>
									{key}
								</TableHead>
							))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id + '_sqlSearchTable'}>
							{Object.values(row).map((value: any) => (
								<TableCell className="font-mono" key={value}>
									{value}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default SqlSearchTable;
