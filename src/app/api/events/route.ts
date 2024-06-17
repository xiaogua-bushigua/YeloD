import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const timerId = setInterval(() => {
		const formattedData = `data: ${JSON.stringify({ content: 'hello' })}\n\n`;
		writer.write(encoder.encode(formattedData));
	}, 1000);

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
