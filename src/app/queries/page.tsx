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
				<div className="flex justify-end mb-2 mr-4 mt-1">
					<ButtonUI
						variant="outline"
						className="font-mono w-16 ml-4 h-8 text-slate-700 hover:text-white bg-white hover:bg-slate-700 active:ring active:ring-slate-300 active:bg-slate-600"
					>
						New
					</ButtonUI>
					<ButtonUI
						variant="outline"
						className="font-mono w-16 ml-4 h-8 text-white hover:text-white bg-violet-600 hover:bg-violet-800 active:ring active:ring-violet-200 active:bg-violet-700"
					>
						Save
					</ButtonUI>
				</div>
				<QueryTable />
			</div>
		</LayoutWrapper>
	);
}
