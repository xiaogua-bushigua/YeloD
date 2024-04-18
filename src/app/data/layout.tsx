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
	const bread_paths = [
		{ name: 'Databases', path: '/databases' },
		{ name: 'Collections', path: '/collections' },
		{ name: 'Documents', path: '/documents' },
	];
	return (
		<>
			<Bread breads={bread_paths} />
			{children}
		</>
	);
};

export default DataLayout;
