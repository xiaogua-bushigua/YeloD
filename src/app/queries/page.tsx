import LayoutWrapper from '@/components/LayoutWrapper';
import QueryTable from '@/components/QueryTable';
import { Button as ButtonUI } from '@/components/ui/button';

export const metadata = {
	title: 'Queries',
	description: 'queries page',
};

export default function Queries() {
	return (
		<LayoutWrapper>
			<div className="w-full h-full overflow-y-auto">
				<QueryTable />
			</div>
		</LayoutWrapper>
	);
}
