import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import { Db } from 'mongodb';
import { PrismaClient } from '@prisma/client';

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
				if (uri.split('://')[0] === 'mongodb') {
					const { db, client } = await dbConnectPublic(uri);
					const dbStats = await db.stats();
					const collections = await getCollectionsInfo(db);
					info.push({ dbStats, collections });
					client.close();
				} else if (uri.split('://')[0] === 'mysql') {
					try {
						const dynamicDbConfig = {
							datasources: {
								db: {
									url: uri,
								},
							},
						};
						const prisma = new PrismaClient(dynamicDbConfig);
						// 获取数据库名称
						const databaseNameQuery = await prisma.$queryRaw<
							Array<{
								databaseName: string;
							}>
						>`SELECT DATABASE() AS databaseName`;
						const databaseName = databaseNameQuery[0].databaseName;
						console.log('Database Name:', databaseName);
					} catch (error) {
						console.log(error);
					}
					info.push({
						collections: [
							{
								name: 'string',
								options: {
									count: 'number',
									storageSize: 'number',
								},
							},
						],
						dbStats: {
							db: 'string',
							storageSize: 'number',
						},
					});
				}
			})
		);
		return NextResponse.json({ info, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};
