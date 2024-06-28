import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import { PrismaClient, Prisma } from '@prisma/client';

async function getCollectionsInfoMongoDB(uri: string) {  
	try {
		const { db } = await dbConnectPublic(uri);
		const dbStats = await db.stats();
		const collections = [];
		const cursor = db.listCollections();
		for await (const collection of cursor) {
			const options = await db.command({ collStats: collection.name });
			collections.push({ name: collection.name, options });
		}
		return {
			dbStats,
			collections,
			type: 'mongodb',
		};
	} catch (error) {
		console.log(error);
		return {
			dbStats: {
				db: '',
				storageSize: 0,
			},
			tables: [],
			type: 'mongodb',
		};
	}
}

async function getCollectionsInfoMysql(uri: string) {
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
		// 获取所有的表名
		const tablesNameResult = await prisma.$queryRaw<
			Array<{
				tableName: string;
			}>
		>`
    SELECT table_name AS tableName
    FROM information_schema.tables
    WHERE table_schema = ${databaseName}
    AND table_type = 'BASE TABLE';
  `;
		const tablesName = tablesNameResult.map((table) => table.tableName);
		// 依次获取表的行数和大小
		let Tables = [];
		for (let i = 0; i < tablesName.length; i++) {
			const tableInfoResult = await prisma.$queryRaw<
				Array<{
					rowCount: number;
					tableSize: number;
				}>
			>`
      SELECT (data_length + index_length) / 1024 / 1024 AS tableSize,
      (
          SELECT COUNT(*)
          FROM \`${Prisma.sql([tablesName[i]])}\`
      ) AS rowCount
      FROM information_schema.tables
      WHERE table_schema = ${databaseName}
      AND table_type = 'BASE TABLE';
    `;
			Tables.push({
				name: tablesName[i],
				options: {
					count: Number(tableInfoResult[0].rowCount),
					storageSize: Number(tableInfoResult[i].tableSize),
				},
			});
		}
    await prisma.$disconnect();
		return {
			dbStats: {
				db: databaseName,
				storageSize: databaseSize,
			},
			tables: Tables,
			type: 'mysql',
		};
	} catch (error) {
		console.log(error);
		return {
			dbStats: {
				db: '',
				storageSize: 0,
			},
			tables: [],
			type: 'mysql',
		};
	}
}

export const GET = async (req: NextRequest) => {
	const urisString = req.nextUrl.searchParams.get('uris');
	if (!urisString) {
		return NextResponse.json({ info: [], status: 400, error: 'No URIs provided' }, { status: 400 });
	}
	try {
		const info: any = [];
		const uris: string[] = JSON.parse(decodeURIComponent(urisString));
		// 并行处理多个数据库连接
		await Promise.all(
			uris.map(async (uri: string, index: number) => {
				if (uri.includes('mongodb')) {
					const { client } = await dbConnectPublic(uri);
					const res = await getCollectionsInfoMongoDB(uri);
					info[index] = res;
					client.close();
				} else if (uri.includes('mysql')) {
					const res = await getCollectionsInfoMysql(uri);
					info[index] = res;
				}
			})
		);
		return NextResponse.json({ info, status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ info: [], status: 500, error }, { status: 500 });
	}
};
