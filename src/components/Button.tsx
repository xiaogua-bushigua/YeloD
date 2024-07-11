import Image from 'next/image';

interface Props {
	text?: string;
	className: string;
	src?: string;
	iconSize?: number;
	onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ text, className, iconSize, src, onClick, disabled }: Props) => {
	return (
		<button
			onClick={onClick}
			className={`min-w-8 flex gap-2 items-center justify-center rounded-md py-3 text-white ${className}`}
			disabled={disabled}
		>
			{src && <Image src={src} alt={text || ''} width={iconSize} height={iconSize} />}
			{text && <span className="font-mono">{text}</span>}
		</button>
	);
};

export default Button;
