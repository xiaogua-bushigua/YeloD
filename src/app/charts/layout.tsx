import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
	title: 'Charts',
	description: 'charts page',
};

const ChartsLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default ChartsLayout;
