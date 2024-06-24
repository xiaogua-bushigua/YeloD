import { NextRequest } from 'next/server';
import { IQuery } from '@/lib/models';
import { getFieldData } from '../dbTags/route';

export async function GET(request: NextRequest) {
	const queries = JSON.parse(request.nextUrl.searchParams.get('params')!) as IQuery[];
	const interval = JSON.parse(request.nextUrl.searchParams.get('interval')!) as string;

	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const timerId = setInterval(async () => {
		try {
			const promises = queries.map(async (query) => {
				const data = await getFieldData(
					query.uri,
					query.collectionName || '',
					query.tableName || '',
					query.query,
					query.field || '',
					query.method
				);
				return { data, tag: query.tag, queryId: query._id };
			});
			const info = await Promise.all(promises);
			const formattedData = `data: ${JSON.stringify({ info })}\n\n`;
			await writer.write(encoder.encode(formattedData));
		} catch (error) {
			console.error('Error fetching data:', error);
			const errorMessage = `event: error\ndata: ${JSON.stringify({ error: 'Error fetching data' })}\n\n`;
			await writer.write(encoder.encode(errorMessage));
		}
	}, parseInt(interval));

	request.signal.onabort = () => {
		console.log('closing writer');
		clearInterval(timerId);
		writer.close();
	};

	return new Response(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache, no-transform',
		},
	});
}
