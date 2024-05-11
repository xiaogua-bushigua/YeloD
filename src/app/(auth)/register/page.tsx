'use client';

import { useEffect } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { register } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface IForm {
	title: string;
	name: string;
	type: string;
	placeholder: string;
}

const formProps: Array<IForm> = [
	{
		title: 'Full name',
		name: 'username',
		type: 'type',
		placeholder: 'Enter at most 18 characters',
	},
	{
		title: 'Password',
		name: 'password',
		type: 'password',
		placeholder: 'Enter at least 8+ characters',
	},
	{
		title: 'Password Again',
		name: 'passwordRepeat',
		type: 'password',
		placeholder: 'Repeat your password',
	},
];

const Page = () => {
	const router = useRouter();
	const [state, formAction] = useFormState(register, undefined);

	useEffect(() => {
		state?.success && router.push('/login');
	}, [state?.success, router]);

	return (
		<section className="flex h-screen flex-col items-center justify-center w-full bg-neutral-50">
			<form className="flex flex-col items-center gap-4 w-1/2" action={formAction}>
				<h1 className="text-4xl font-mono mb-4 font-bold">Register</h1>
				{formProps.map((item) => (
					<Input
						key={item.title}
						title={item.title}
						name={item.name}
						type={item.type}
						placeholder={item.placeholder}
						className="bg-neutral-100 w-full"
					/>
				))}
				<span className="font-mono text-red-700 h-6 my-[-10px]">{state?.error || ' '}</span>
				<Button text="Register" className="w-full bg-violet-500" />
				<Link href="/login" className="mt-[-10px] font-mono text-slate-700 cursor-pointer">
					Have an account? Login Now!
				</Link>
			</form>
		</section>
	);
};

export default Page;
