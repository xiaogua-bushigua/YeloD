'use client';

import { Session } from 'next-auth';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import Image from 'next/image';
import { setSessionState } from '@/store/reducers/authSlice';
import { useAppDispatch } from '@/store/hooks';
import LoadingIcon from '../Icons/LoadingIcon';

const Header = () => {
	const { data: session } = useSession();
	const [sessionData, setSessionData] = useState<Session | null>(null);
	const [hover, setHover] = useState(false);
	const card = useRef<null | HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		setSessionData(session);
		dispatch(setSessionState(session?.user || null));
    console.log(session)
	}, [session]);

	const handleClickOutside = (event: any) => {
		if (!card.current) return;
		if (!card.current?.contains?.(event.target)) {
			setHover(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	return (
		<div className="relative h-12 bg-zinc-50 border-b border-slate-200 flex items-center justify-end pr-12">
			<img
				onClick={() => setHover(!hover)}
				src={sessionData?.user?.image || '/imgs/userDefault.svg'}
				alt="userDefaultImg"
				width={30}
				height={30}
				className="cursor-pointer mr-2 rounded-full"
				// onError={(e) => {
				// 	const target = e.target as HTMLImageElement;
				// 	if (target.src !== window.location.origin + '/imgs/userDefault.svg') {
				// 		target.onerror = null; // 防止无限循环
				// 		target.src = '/imgs/userDefault.svg';
				// 	}
				// }}
			/>
			<div className="min-w-20 h-full flex justify-center items-center">
				{sessionData?.user?.username || sessionData?.user?.name ? (
					<p onClick={() => setHover(!hover)} className="font-mono text-center text-slate-600 cursor-pointer">
						{sessionData?.user?.username || sessionData?.user?.name}
					</p>
				) : (
					<LoadingIcon size={28} />
				)}
			</div>
			{hover && (
				<div
					ref={card}
					className="absolute bottom-[-90px] w-40 h-30 z-10 bg-zinc-50 rounded-md px-1 py-4 shadow-md border border-slate-100"
				>
					<Button
						text="Sign out"
						src="/imgs/logout.svg"
						iconSize={16}
						className="w-full bg-slate-200 text-zinc-800 py-1 text-md gap-4"
						onClick={() => {
							localStorage.removeItem('persist:root');
							signOut();
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default Header;
