import ExtraLoginForm from '@/components/Auth/ExtraLoginForm';
import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';

const Page = () => {
	return (
		<section className="flex h-screen flex-col items-center justify-center w-full bg-neutral-50">
			<div className="w-1/2 mt-2">
				<LoginForm />
				<span className="font-mono text-slate-700 self-start">or sign in with: </span>
				<ExtraLoginForm />
				<Link href="/register" className="font-mono text-slate-700 cursor-pointer">
					{'Don\'t have an account? Register Now!'}
				</Link>
			</div>
		</section>
	);
};

export default Page;
