import Image from 'next/image';

const Logo = ({ size }: { size: number }) => {
	return (
		<div className="flex gap-2 items-center">
			<Image src="/imgs/logo.png" alt="logo" width={size} height={size} />
			<span className="font-mono font-bold text-lg">YeloD</span>
		</div>
	);
};

export default Logo;
