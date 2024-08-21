'use client';

import ExtraLoginForm from '@/components/Auth/ExtraLoginForm';
import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const Page = () => {
	const [isLogining, setIsLogining] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		setIsLogining(false);
	}, []);

	const handleChangeLogin = () => {
		setIsLogining(true);
	};

	const handleTouristRegisterClick = () => {
		toast({
			title: 'Suspend',
			description: 'Custom login is not available.',
		});
		return;
	};

	return (
		<section className="flex h-screen flex-col items-center justify-center w-full bg-neutral-50">
			<div className="w-1/2 mt-2">
				<LoginForm isLogining={isLogining} onChangeLogin={handleChangeLogin} />
				<span className="font-mono text-slate-700 self-start">or sign in with: </span>
				<ExtraLoginForm isLogining={isLogining} onChangeLogin={handleChangeLogin} />
				{/* <Link href="/register" className="font-mono text-slate-700 cursor-pointer">
					{"Don't have an account? Register Now!"}
				</Link> */}
				<p className="font-mono text-slate-700 cursor-pointer" onClick={handleTouristRegisterClick}>
					{"Don't have an account? Register Now!"}
				</p>
			</div>
		</section>
	);
};

export default Page;
