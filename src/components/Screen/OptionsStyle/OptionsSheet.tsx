import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import Padding from './Padding';
import Label from './Label';
import Title from './Title';
import Axis from './Axis';
import DataColors from './DataColors';

const OptionsSheet = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Sheet>
			<SheetTrigger>{children}</SheetTrigger>
			<SheetContent className="w-72 min-w-72">
				<SheetHeader>
					<SheetTitle className="my-4">Change chart styles here!</SheetTitle>
				</SheetHeader>
				<Padding />
				<Label />
				<Title />
				<Axis />
				<DataColors />
			</SheetContent>
		</Sheet>
	);
};

export default OptionsSheet;
