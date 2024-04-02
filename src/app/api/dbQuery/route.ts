import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/lib/models';

// 获取查询语句对应的文档合集
export const POST = async (req: NextRequest) => {
	const { uri, collectionName, query } = await req.json();
	try {
		const db = await dbConnectPublic(uri);
		const collection = db.collection(collectionName);
		console.log(query);

		let data;
		if (query.type === 'all') {
			data = await collection.find().toArray();
		} else if (query.type === 'filtered') {
			let queryBuilder = collection.find(query.find);
			if (query.sort) queryBuilder = queryBuilder.sort(query.sort);
			if (query.limit) queryBuilder = queryBuilder.limit(query.limit);
			data = await queryBuilder.toArray();
		}
		return NextResponse.json({ data, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};

// 向管理员数据库更新用户保存的查询语句
export const PATCH = async (req: NextRequest) => {
	try {
		dbConnect();
		const { queryObj, username } = await req.json();
		let { queries } = await UserModel.findOne({ username }, { queries: 1 });
		queries = [...queries, queryObj];
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 });
	} catch (err) {
		console.log(err);
		throw new Error('Failed to fetch the user!');
	}
};
