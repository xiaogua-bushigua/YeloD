import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import { PrismaClient, Prisma } from '@prisma/client';

const postSql = async (uri: string, innerName: string, query: any) => {
	const dynamicDbConfig = {
		datasources: {
			db: {
				url: uri,
			},
		},
	};
	const prisma = new PrismaClient(dynamicDbConfig);
	// const data = await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(innerName)} ${Prisma.raw(query)}`;
	const data = await prisma.$queryRaw`SELECT * FROM ${Prisma.sql([innerName])} ${Prisma.sql([query])}`;
	await prisma.$disconnect();
	return data;
};

const postMongoDB = async (uri: string, innerName: string, query: any) => {
	let data;
	try {
		const { db, client } = await dbConnectPublic(uri);
		const collection = db.collection(innerName);
		if (query.type === 'all') {
			data = await collection.find().toArray();
		} else if (query.type === 'filtered') {
			let queryBuilder = collection.find();
			// 检查操作的顺序，并逐个应用
			for (const operation of query.orders) {
				if (operation === 'find') {
					queryBuilder = collection.find(query.find);
				} else if (operation === 'sort') {
					queryBuilder = queryBuilder.sort(query.sort);
				} else if (operation === 'limit') {
					queryBuilder = queryBuilder.limit(query.limit);
				}
			}
			// queryBuilder = collection.find(query.find).limit(query.limit).sort(query.sort);
			data = await queryBuilder.toArray();
		}
		client.close();
		return data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// 获取查询语句对应的文档合集
export const GET = async (req: NextRequest) => {
	const paramString = req.nextUrl.searchParams.get('param');
	if (!paramString) {
		return NextResponse.json({ info: [], status: 400, error: 'No parameters provided' }, { status: 400 });
	}
	try {
		const { uri, innerName, query } = JSON.parse(decodeURIComponent(paramString));
		let data = [] as any[];
		if (uri.includes('mongodb')) data = (await postMongoDB(uri, innerName, query)) as any[];
		else if (uri.includes('mysql')) data = (await postSql(uri, innerName, query)) as any[];
		return NextResponse.json({ data, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};
