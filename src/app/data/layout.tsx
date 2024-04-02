import Bread from '@/components/Bread';
import LayoutWrapper from '@/components/LayoutWrapper';

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
		<LayoutWrapper>
			<Bread breads={bread_paths} />
			{children}
		</LayoutWrapper>
	);
};

export default DataLayout;
