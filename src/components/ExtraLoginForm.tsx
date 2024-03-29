'use client';

import Button from '@/components/Button';
import { signIn } from 'next-auth/react';

const ExtraLoginForm = () => {
	return (
		<div className="flex gap-4 w-full mb-4 mt-1">
			<Button
				text="Github"
				src="/imgs/github.svg"
				iconSize={20}
				className="w-full gap-4 bg-slate-300 text-slate-600 hover:text-slate-100 py-2 text-md"
				onClick={() => signIn('github', { callbackUrl: '/' })}
			/>
			<Button
				text="Google"
				src="/imgs/google.svg"
				iconSize={20}
				className="w-full gap-4 bg-slate-300 text-slate-600 hover:text-slate-100 py-2 text-md"
				onClick={() => signIn('google', { callbackUrl: '/' })}
			/>
		</div>
	);
};

export default ExtraLoginForm;
