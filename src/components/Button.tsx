import Image from 'next/image';

interface Props {
	text?: string;
	className: string;
	src?: string;
	iconSize?: number;
	onClick?: () => void;
}

const Button = ({ text, className, iconSize, src, onClick }: Props) => {  
	return (
		<button
			onClick={onClick}
			className={`min-w-8 flex gap-2 items-center justify-center rounded-md py-3 text-white ${className}`}
		>
			{src && (
				<Image
					src={src}
					alt={text || ''}
					width={iconSize}
					height={iconSize}
				/>
			)}
			{text && <span className="font-mono">{text}</span>}
		</button>
	);
};

export default Button;
