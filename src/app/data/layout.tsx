import Bread from '@/components/Bread';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
	title: 'Data',
	description: '我是管理',
};

const bread_paths = [
	{ name: 'databases', path: '/databases' },
	{ name: 'collections', path: '/collections' },
	{ name: 'documents', path: '/documents' },
	{ name: 'document', path: '/document' },
];

const DataLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<LayoutWrapper>
			<Bread breads={bread_paths} />
			{children}
		</LayoutWrapper>
	);
};

export default DataLayout;
