import LayoutWrapper from '@/components/LayoutWrapper';
import { Button } from '@/components/ui/button';

export const metadata = {
	title: 'Queries',
	description: 'queries page',
};

export default function Queries() {
	return (
		<LayoutWrapper>
			<Button className='bg-red-500'>Click me</Button>
		</LayoutWrapper>
	);
}
