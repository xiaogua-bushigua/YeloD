import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/lib/models';
import { PrismaClient, Prisma } from '@prisma/client';

// 获取所有的查询语句信息
export const GET = async (req: NextRequest) => {
	try {
		await dbConnect();
		const username = req.nextUrl.searchParams.get('username');
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		return NextResponse.json({ queries, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

const postSql = async (uri: string, innerName: string, query: any) => {
	const dynamicDbConfig = {
		datasources: {
			db: {
				url: uri,
			},
		},
	};
	const prisma = new PrismaClient(dynamicDbConfig);
	const data = await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(innerName)} ${Prisma.raw(query)}`;
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
export const POST = async (req: NextRequest) => {
	const { type, uri, innerName, query } = await req.json();
	let data;
	try {
		if (type === 'mongodb') data = await postMongoDB(uri, innerName, query);
		else if (type === 'sql') data = await postSql(uri, innerName, query);
		return NextResponse.json({ data, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 向管理员数据库更新用户保存的查询语句
export const PATCH = async (req: NextRequest) => {
	try {
		await dbConnect();
		let { queryObj, username } = await req.json();
		queryObj.field = '';
		queryObj.tag = '';
		let { queries } = await UserModel.findOne({ username }, { queries: 1 });
		queries = [...queries, queryObj];
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500, error }, { status: 500 });
	}
};
