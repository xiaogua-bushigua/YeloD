import Image from 'next/image';
import Logo from '@/components/Layout/Logo';
import Link from 'next/link';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex w-screen">
			<Link href="https://github.com/xiaogua-bushigua/YeloD" target='_blank'>
				<Image
					src={'/imgs/github.png'}
					alt="github image"
					width={40}
					height={40}
					className="fixed top-4 left-4"
				/>
			</Link>
			<div className="flex flex-col items-center justify-center flex-1 h-screen">
				{children}
				<footer className="flex flex-col items-center pb-2 bg-neutral-50 w-full">
					<Logo size={36} />
					<p className="text-slate-500 font-mono">Draw the database.</p>
				</footer>
			</div>
			<div className="h-screen flex items-center bg-violet-500 w-[40%] lg:w-1/2">
				<div className="relative h-4/6 w-full">
					<Image src={'/imgs/login.png'} alt="login image" fill className="object-contain" />
				</div>
			</div>
		</div>
	);
}
