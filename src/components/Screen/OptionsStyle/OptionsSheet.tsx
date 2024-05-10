import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import Padding from './Padding';
import Label from './Label';
import Title from './Title';
import Axis from './Axis';
import DataColors from './DataColors';

const OptionsSheet = ({
	children,
	onOpen,
	chartId,
}: Readonly<{
	children: React.ReactNode;
	onOpen: (open: boolean) => void;
	chartId: string;
}>) => {
	return (
		<Sheet onOpenChange={(open) => onOpen(open)}>
			<SheetTrigger>{children}</SheetTrigger>
			<SheetContent className="w-72 min-w-72">
				<SheetHeader>
					<SheetTitle className="my-4 font-mono">Change chart styles</SheetTitle>
				</SheetHeader>
				<Padding chartId={chartId} />
				<Label chartId={chartId} />
				<Title chartId={chartId} />
				<Axis chartId={chartId} />
				<DataColors chartId={chartId} />
			</SheetContent>
		</Sheet>
	);
};

export default OptionsSheet;
