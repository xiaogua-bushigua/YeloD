export const postProcessing = (data: any[], method: string) => {
	if (!data.length || method === 'none') return data;

	if (['odd', 'even', 'length', 'limit(7)', 'limit(30)'].includes(method)) {
		switch (method) {
			case 'odd':
				return data.filter((d, index) => index % 2 !== 0);
			case 'even':
				return data.filter((d, index) => index % 2 == 0);
			case 'length':
				return [data.length];
			case 'limit(7)':
				return data.slice(-7);
			case 'limit(30)':
				return data.slice(-30);
			default:
				return data;
		}
	} else {
		// 需要确实为数字的才能做数学计算
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
