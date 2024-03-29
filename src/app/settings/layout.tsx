export const metadata = {
	title: 'Settings',
	description: '我是管理',
};

const SettingsLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <div>{children}</div>;
};

export default SettingsLayout;
