import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import { Db } from 'mongodb';
import { PrismaClient, Prisma } from '@prisma/client';

async function getCollectionsInfoMongoDB(db: Db) {
	const collections = [];
	const cursor = db.listCollections();
	for await (const collection of cursor) {
		const options = await db.command({ collStats: collection.name });
		collections.push({ name: collection.name, options });
	}
	return collections;
}

async function getCollectionsInfoMysql(uri: string) {
	const dynamicDbConfig = {
		datasources: {
			db: {
				url: uri,
			},
		},
	};
	const prisma = new PrismaClient(dynamicDbConfig);
	// 获取数据库名称
	const databaseNameResult = await prisma.$queryRaw<
		Array<{
			databaseName: string;
		}>
	>`SELECT DATABASE() AS databaseName`;
	const databaseName = databaseNameResult[0].databaseName;
	// 获取数据库体积
	const databaseSizeResult = await prisma.$queryRaw<
		Array<{
			databaseSize: string;
			databaseName: string;
		}>
	>`
    SELECT table_schema AS databaseName, 
    SUM(data_length + index_length) / 1024 / 1024 AS databaseSize 
    FROM information_schema.tables
    WHERE table_schema = ${databaseName}
    GROUP BY table_schema;
  `;

	const databaseSize = databaseSizeResult[0].databaseSize;
  const tableName1 = 'nextapp.consumer';
	// 获取表信息
	const tableInfoResult = await prisma.$queryRaw<
		Array<{
			tableName: string;
			rowCount: number;
			tableSize: number;
		}>
	>`
    SELECT table_name AS tableName,
    (data_length + index_length) / 1024 / 1024 AS tableSize,
    (
        SELECT COUNT(*)
        FROM ${Prisma.raw(tableName1)}
    ) AS rowCount
    FROM information_schema.tables
    WHERE table_schema = ${databaseName}
    AND table_type = 'BASE TABLE';
	`;

	const tables = tableInfoResult.map((table) => ({
		name: table.tableName,
		options: {
			count: Number(table.rowCount),
			storageSize: table.tableSize,
		},
	}));
	return {
		dbStats: {
			db: databaseName,
			storageSize: databaseSize,
		},
		tables: tables,
		type: 'mysql',
	};
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
					const collections = await getCollectionsInfoMongoDB(db);
					info.push({ dbStats, collections, type: 'mongodb' });
					client.close();
				} else if (uri.split('://')[0] === 'mysql') {
					const res = await getCollectionsInfoMysql(uri);
					info.push(res);
				}
			})
		);

		return NextResponse.json({ info, status: 200 });
	} catch (error) {
		console.log(error, 123);
		return NextResponse.json({ error, status: 500 });
	}
};
