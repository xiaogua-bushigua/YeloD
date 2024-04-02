import LoadingIcon from './icons/LoadingIcon';

const Loading = ({ size }: { size: number }) => {
	return (
		<div className="w-full h-full flex items-center justify-center bg-violet-50">
			<LoadingIcon size={size} />
		</div>
	);
};

export default Loading;
