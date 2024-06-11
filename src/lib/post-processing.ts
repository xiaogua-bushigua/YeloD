export const postProcessing = (data: any[], method: string) => {
	if (!data.length || method === 'none') return data;

	if (['odd', 'even', 'length'].includes(method)) {
		switch (method) {
			case 'odd':
				return data.filter((d, index) => index % 2 !== 0);
			case 'even':
				return data.filter((d, index) => index % 2 == 0);
			case 'length':
				return [data.length];
			default:
				return data;
		}
	} else {
		const result = isNumericArray(data);
		if (!result) return data;
		const newData = data.map((d) => parseFloat(String(d)));
		switch (method) {
			case 'sum':
				return [newData.reduce((a, b) => a + b, 0)];
			case 'max':
				return [Math.max(...newData)];
			case 'min':
				return [Math.min(...newData)];
			case 'average':
				return [newData.reduce((a, b) => a + b, 0) / newData.length];
			default:
				return data;
		}
	}

};

const isNumericArray = (arr: any[]) => {
	return arr.every((item) => !isNaN(parseFloat(String(item))) && isFinite(Number(item)));
};
