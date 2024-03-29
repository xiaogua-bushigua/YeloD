import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionWrapper from '@/components/SessionWrapper';
import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		default: 'YeloD - Visualization',
		template: 'YeloD - %s',
	},
	description: 'an application for visualize database',
	icons: '/imgs/logo.png',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>
					<SessionWrapper>{children}</SessionWrapper>
				</StoreProvider>
			</body>
		</html>
	);
}
