'use client';

import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useState, useRef } from 'react';
import Button from '@/components/Button';
import { saveDbLinks } from '@/store/reducers/dbSlice';
import { Button as ButtonUI } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function Settings() {
	const childRef = useRef<HTMLInputElement[] | null[]>([]);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { database } = useAppSelector((state: RootState) => state.db);
	const dispatch = useAppDispatch();
	const [dbLinks, setDbLinks] = useState(database as string[]);
	const { toast } = useToast();

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
		const res = await fetch('/api/dbLinks', {
			method: 'PATCH',
			body: JSON.stringify({ username: user.name || user.username, links: lks }),
		});
		const { status } = await res.json();
		const description = status === 200 ? 'Links has been saved.' : 'Something went wrong. Please try again.';
		toast({
			title: 'Success',
			description,
		});
	};
	return (
		<>
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
								className="w-9 h-9 ml-4 bg-violet-500 shadow-sm active:ring active:ring-violet-200 active:bg-violet-700"
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
			<ButtonUI
				variant="outline"
				onClick={handleSave}
				className="font-mono text-white w-18 h-10 hover:bg-violet-500 hover:text-white bg-violet-500 active:ring active:ring-violet-200 active:bg-violet-700"
			>
				Save
			</ButtonUI>
		</>
	);
}
