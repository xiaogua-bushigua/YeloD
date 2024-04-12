// 目前无法解决sort，limit谁在前谁在后的问题

export const transferQuery = (query: string | undefined):{type: string; find?: any; sort?: any; limit?: number} => {
	if (!query) {
		return {
			type: 'all',
		};
	}

	// 使用正则表达式来提取需要的部分
	const findPattern = /\.find\((.*?)\)/;
	const sortPattern = /\.sort\((.*?)\)/;
	const limitPattern = /\.limit\((\d+)\)/;

	// 使用正则表达式的 exec 方法来提取匹配的部分
	const findMatch = findPattern.exec(query);
	const sortMatch = sortPattern.exec(query);
	const limitMatch = limitPattern.exec(query);

	// 使用 JSON.parse() 将提取的字符串转换为对象
	const result = {
		find: findMatch ? JSON.parse(findMatch[1]) : undefined,
		sort: sortMatch ? JSON.parse(sortMatch[1]) : undefined,
		limit: limitMatch ? parseInt(limitMatch[1]) : undefined,
		type: 'filtered',
	};

	return result;
};
