'use client';

import { login } from '@/lib/actions';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useFormState } from 'react-dom';
import { signIn } from 'next-auth/react';
import { IStringKeyValueObject } from '@/interfaces';
import { useState } from 'react';

const formProps = [
	{
		title: 'Full name',
		type: 'type',
		name: 'username',
		placeholder: 'Enter your full name',
		value: 'yeloD',
	},
	{
		title: 'Password',
		type: 'password',
		name: 'password',
		placeholder: 'Enter your password',
		value: '12345678',
	},
];

const LoginForm = ({ isLogining, onChangeLogin }: { isLogining: boolean; onChangeLogin: () => void }) => {
	const [loading, setLoading] = useState(false);
	const handleLogin = async (preState: any, formData: FormData) => {
		if (loading) return;
		setLoading(true);
		const { username, password } = Object.fromEntries(formData) as IStringKeyValueObject;
		if (!username || !password) return { error: 'Please complete the form' };
		const res = await login(username, password);
		if (res.error) return res;
		const credentialsValid = await signIn('credentials', {
			username,
			password,
			callbackUrl: '/data',
		});
		if (credentialsValid?.error) return { error: 'Invalid credentials' };
		return { success: true };
	};

	const [state, formAction] = useFormState(handleLogin, undefined);

	return (
		<form className="flex flex-col items-center gap-4 w-full" action={formAction}>
			<h1 className="text-4xl font-mono mb-4 font-bold">Login</h1>
			{formProps.map((item) => (
				<Input
					key={item.title}
					title={item.title}
					type={item.type}
					name={item.name}
					placeholder={item.placeholder}
					className="bg-neutral-100 w-full"
					value={item.value}
				/>
			))}
			<Button
				text={isLogining ? 'Logging in...' : 'Login'}
				onClick={onChangeLogin}
				className="w-full bg-violet-500"
			/>
			<p className="font-mono mt-[-10px] text-red-700 h-6">{state?.error || ' '}</p>
		</form>
	);
};

export default LoginForm;
