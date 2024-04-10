import ChartOperations from '@/components/ChartOperations';
import ChartOptions from '@/components/ChartOptions';
import ChartTags from '@/components/ChartTags';
import ChartView from '@/components/ChartView';

const page = () => {
	return (
		<div className="w-full h-full">
			<ChartOperations />
			<div className="flex gap-4 w-full mt-4 h-[calc(100vh-140px)]">
				<div className="w-1/2 bg-white rounded-lg shadow-md">
					<div className="w-full h-3/4">
						<ChartView />
					</div>
					<ChartTags />
				</div>
				<div className="w-1/2 rounded-lg">
					<ChartOptions />
				</div>
			</div>
		</div>
	);
};

export default page;
