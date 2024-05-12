'use client';

import { useEffect } from 'react';
import DataSerie from './DataSerie';

const DataSeries = ({ chartId, option }: { chartId: string; option: any }) => {
  const colors = option.color;

  useEffect(() => {}, [option]);
  
	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Data series</p>
			{option.series && option.series.map((serie: any, index: number) => (
				<DataSerie
					key={'serie_' + index}
					chartId={chartId}
					index={index}
					serie={serie}
					scolor={colors[index]}
				/>
			))}
		</div>
	);
};

export default DataSeries;
