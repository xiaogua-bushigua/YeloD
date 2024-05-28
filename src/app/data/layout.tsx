import Bread from '@/components/Bread';

export const metadata = {
	title: 'Data',
	description: 'data page',
};

const DataLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			<Bread />
			{children}
		</>
	);
};

export default DataLayout;
