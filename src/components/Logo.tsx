import Image from 'next/image';

interface Props {
	size: number;
}

const Logo = (props: Props) => {
	return (
		<div className="flex gap-2 items-center">
			<Image src="/imgs/logo.png" alt="logo" width={props.size} height={props.size} />
			<span className="font-mono font-bold text-lg">YeloD</span>
		</div>
	);
};

export default Logo;
