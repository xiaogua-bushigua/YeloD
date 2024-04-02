import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';

export const POST = async (req: NextRequest) => {
	const { uris } = await req.json();
	try {
		const info = [] as any[];
		for (const uri of uris) {
			const db = mongoose.createConnection(uri!);
			let dbStats;
			let collections: any = [];
			await new Promise((resolve, reject) => {
				db.once('open', async () => {
					try {
						dbStats = await db.db.stats();
						const cursor = db.db.listCollections();
						for await (const collection of cursor) {
							const options = await db.db.command({ collStats: collection.name });
							collections.push({ name: collection.name, options });
						}
						info.push({ dbStats, collections });
						resolve(null);
					} catch (error) {
						reject(error);
            return NextResponse.json({ error, status: 500 });
					}
				});
			});
		}
		return NextResponse.json({ info, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};
