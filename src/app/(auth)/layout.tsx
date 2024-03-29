import Image from 'next/image';
import Logo from '@/components/Logo';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex w-screen">
			<div className="flex flex-col items-center justify-center flex-1 h-screen">
				{children}
				<footer className="flex flex-col items-center pb-2 bg-neutral-50 w-full">
					<Logo size={36} />
					<p className="text-slate-500 font-mono">For database visualization.</p>
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
