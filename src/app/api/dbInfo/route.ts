import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import { Db } from 'mongodb';

// 获取数据库集合信息
async function getCollectionsInfo(db: Db) {
	const collections = [];
	const cursor = db.listCollections();
	for await (const collection of cursor) {
		const options = await db.command({ collStats: collection.name });
		collections.push({ name: collection.name, options });
	}
	return collections;
}

export const POST = async (req: NextRequest) => {
	const { uris } = await req.json();
	try {
		const info: any = [];
		// 并行处理多个数据库连接
		await Promise.all(
			uris.map(async (uri: string) => {
				const { db, client } = await dbConnectPublic(uri);
				const dbStats = await db.stats();
				const collections = await getCollectionsInfo(db);
				info.push({ dbStats, collections });
				client.close();
			})
		);
		return NextResponse.json({ info, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};
