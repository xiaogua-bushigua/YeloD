'use client';

import LayoutWrapper from '@/components/LayoutWrapper';
import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useState, useRef } from 'react';
import Button from '@/components/Button';
import { saveDbLinks } from '@/store/reducers/dbSlice';

export default function Settings() {
	const childRef = useRef<HTMLInputElement[] | null[]>([]);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { database } = useAppSelector((state: RootState) => state.db);
	const dispatch = useAppDispatch();
	const [dbLinks, setDbLinks] = useState(database as string[]);

	const handleAdd = () => {
		setDbLinks((prev) => [...prev, '']);
	};
	const handleDel = (index: number) => {
		setDbLinks((prev) => {
			const newLinks = [...prev];
			newLinks.splice(index, 1);
			return newLinks;
		});
	};
	const handleSave = async () => {
		const lks: string[] = childRef.current.filter((child) => child).map((el) => el!.value);
		dispatch(saveDbLinks(lks));
		await fetch('/api/dbLinks', {
			method: 'PATCH',
			body: JSON.stringify({ username: user.name || user.username, links: lks }),
		});
	};
	return (
		<LayoutWrapper>
			{dbLinks.map((db, index) => (
				<div key={db + index} className="mb-4 flex w-full">
					<Input
						ref={(ref) => {
							childRef.current[index] = ref;
						}}
						title={'database' + (index + 1)}
						name="database"
						type="text"
						placeholder="Enter your database link"
						className="bg-neutral-50 rounded-md w-3/4 shadow-md border border-slate-200"
						value={db}
					/>
					<div className="flex w-48 items-center">
						{index === dbLinks.length - 1 && (
							<Button
								text=""
								src="/imgs/add.svg"
								iconSize={18}
								className="w-9 h-9 ml-4 bg-violet-500 shadow-sm"
								onClick={handleAdd}
							/>
						)}
						{dbLinks.length > 1 && (
							<Button
								text=""
								src="/imgs/delete.svg"
								iconSize={18}
								className="w-9 h-9 ml-4 bg-zinc-200 shadow-sm hover:bg-zinc-300 hover:shadow-lg active:bg-zinc-100 focus:ring-zinc-300"
								onClick={() => handleDel(index)}
							/>
						)}
					</div>
				</div>
			))}
			<Button onClick={handleSave} text="Save" className="w-24 bg-violet-500" />
		</LayoutWrapper>
	);
}
