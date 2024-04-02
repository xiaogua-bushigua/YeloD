export const metadata = {
	title: 'Settings',
	description: 'settings page',
};

const SettingsLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <div>{children}</div>;
};

export default SettingsLayout;
