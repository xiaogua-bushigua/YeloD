'use client';

import DataSerie from './DataSerie';

const DataSeries = ({ chartId, option }: { chartId: string; option: any }) => {
	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Data series</p>
			{option.series.map((serie: any, index: number) => (
				<DataSerie key={'serie_' + index} chartId={chartId} index={index} serie={serie} />
			))}
		</div>
	);
};

export default DataSeries;
