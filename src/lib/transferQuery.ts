export const transferQuery = (query: string | undefined): { type: string; find?: any; sort?: any; limit?: number } => {
	let orderedOperations = [];
	if (!query) {
		return {
			type: 'all',
		};
	} else {
		const operations = ['find', 'sort', 'limit'];
		const operationOrder = [];
		for (const operation of operations) {
			const index = query.indexOf(operation);
			if (index !== -1) {
				operationOrder.push({ operation, index });
			}
		}
		operationOrder.sort((a, b) => a.index - b.index);
		orderedOperations = operationOrder.map((item) => item.operation);
	}

	// 使用正则表达式来提取需要的部分
	// const findPattern = /\.find\((.*?)\)/;
	const findPattern = /\.find\((\{.*?\}|.*?)\)/;
	const sortPattern = /\.sort\((.*?)\)/;
	const limitPattern = /\.limit\((\d+)\)/;

	// 使用正则表达式的 exec 方法来提取匹配的部分
	const findMatch = findPattern.exec(query);
	const sortMatch = sortPattern.exec(query);
	const limitMatch = limitPattern.exec(query);

	const findQuery = findMatch ? JSON.parse(findMatch[1]) : undefined;
	const sortQuery = sortMatch ? JSON.parse(sortMatch[1]) : undefined;
	const limitQuery = limitMatch ? parseInt(limitMatch[1]) : undefined;

	// 使用 JSON.parse() 将提取的字符串转换为对象
	const result = {
		find: findQuery,
		sort: sortQuery,
		limit: limitQuery,
		orders: orderedOperations,
		type: 'filtered',
	};

	return result;
};
