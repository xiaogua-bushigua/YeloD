// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		if (pathname.startsWith('/api')) {
			// 开始记录请求时间
			const startTime = Date.now();

			res.on('finish', () => {
				const endTime = Date.now();
				const duration = endTime - startTime;
				const startTimeLocal = new Date(startTime).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
				console.log(`${req.method} ${req.url} ${res.statusCode} in ${duration}ms at ${startTimeLocal}`);
			});
		}

		handle(req, res, parsedUrl);
	}).listen(3000, (err) => {
		if (err) throw err;
		console.log('> Ready on http://localhost:3000');
	});
});
