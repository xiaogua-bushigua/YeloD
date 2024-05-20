'use client';

import { useEffect } from 'react';
import PieSerie from './PieSerie';
import LineBarSerie from './LineBarSerie';

const DataSeries = ({ chartId, option, chartType }: { chartId: string; option: any; chartType: string }) => {
	const colors = option.color;

	useEffect(() => {
    console.log(option.series);
  }, [option.series]);

	return (
		<div className="my-2">
			<p className="font-mono font-bold select-none">- Data series</p>
			{chartType === 'pie'
				? option.series[0].data.map((serie: any, index: number) => (
						<PieSerie
							key={'serie_' + index}
							chartId={chartId}
							index={index}
							serie={serie}
							scolor={colors[index]}
							chartType={chartType}
						/>
				  ))
				: option.series.map((serie: any, index: number) => (
						<LineBarSerie
							key={'serie_' + index}
							chartId={chartId}
							seriesIndex={index}
							scolor={colors[index]}
              chartType={chartType}
						/>
				  ))}
		</div>
	);
};

export default DataSeries;
