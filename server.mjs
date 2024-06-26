import chalk from 'chalk';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		const { pathname } = parsedUrl;

		if (pathname.startsWith('/api')) {
			// 开始记录请求时间
			const startTime = Date.now();

			res.on('finish', () => {
				const endTime = Date.now();
				const duration = endTime - startTime;
				const startTimeLocal = new Date(startTime).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

				let methodColor;
				switch (req.method) {
					case 'GET':
						methodColor = chalk.green;
						break;
					case 'POST':
						methodColor = chalk.blue;
						break;
					case 'PUT':
						methodColor = chalk.yellow;
						break;
					case 'DELETE':
						methodColor = chalk.red;
						break;
					default:
						methodColor = chalk.white;
				}

				let statusColor;
				if (res.statusCode >= 500) {
					statusColor = chalk.red;
				} else if (res.statusCode >= 400) {
					statusColor = chalk.yellow;
				} else if (res.statusCode >= 300) {
					statusColor = chalk.cyan;
				} else if (res.statusCode >= 200) {
					statusColor = chalk.green;
				} else {
					statusColor = chalk.white;
				}

				let logMessage = `${methodColor(req.method)} ${req.url} ${statusColor(
					res.statusCode
				)} in ${duration}ms at ${startTimeLocal}`;
				console.log(logMessage);
			});
		}

		handle(req, res, parsedUrl);
	}).listen(3002, (err) => {
		if (err) throw err;
		console.log('> Ready on http://localhost:3002');
	});
});
