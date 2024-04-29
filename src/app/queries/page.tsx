import QueryTable from '@/components/Query/QueryTable';

export const metadata = {
	title: 'Queries',
	description: 'queries page',
};

export default function Queries() {
	return (
		<div className="w-full h-full overflow-y-auto">
			<QueryTable />
		</div>
	);
}
