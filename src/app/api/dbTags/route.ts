import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { UserModel } from '@/lib/models';
import dbConnectPublic from '@/lib/mongodb_public';
import { transferQuery } from '@/lib/transferQuery';

// 获取查询语句对应文档的某一字段合集
export const POST = async (req: NextRequest) => {
	try {
		const { uri, collectionName, query, field } = await req.json();
		const { db, client } = await dbConnectPublic(uri);
		const collection = db.collection(collectionName);
		const ql = transferQuery(query);
		let array;
		if (ql.type === 'all') {
			array = await collection
				.find()
				.project({ _id: 0, [field]: 1 })
				.toArray();
		} else if (ql.type === 'filtered') {
			let queryBuilder = collection.find(ql.find);
			if (ql.sort) queryBuilder = queryBuilder.sort(ql.sort);
			if (ql.limit) queryBuilder = queryBuilder.limit(ql.limit);
			array = await queryBuilder.project({ _id: 0, [field]: 1 }).toArray();
		}
		client.close();
		array = array?.map((arr) => arr[field]);
		return NextResponse.json({ data: array, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};

// 获取所有的tag标签和该标签对应的查询信息
export const GET = async (req: NextRequest) => {
	try {
		dbConnect();
		const username = req.nextUrl.searchParams.get('username');
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		const data = await Promise.all(
			queries.queries.map(async (query: any) => {
				try {
					const { db, client } = await dbConnectPublic(query.uri);
					const collection = db.collection(query.collectionName);
					const ql = transferQuery(query.query);
					let array;
					if (ql.type === 'all') {
						array = await collection
							.find()
							.project({ _id: 0, [query.field]: 1 })
							.toArray();
					} else if (ql.type === 'filtered') {
						let queryBuilder = collection.find(ql.find);
						if (ql.sort) queryBuilder = queryBuilder.sort(ql.sort);
						if (ql.limit) queryBuilder = queryBuilder.limit(ql.limit);
						array = await queryBuilder.project({ _id: 0, [query.field]: 1 }).toArray();
					}
					client.close();
					array = array?.map((arr) => arr[query.field]);
					return {
						tag: query.tag,
						data: array,
					};
				} catch (error) {
					return { error: `Error processing query: ${error}` };
				}
			})
		);
		return NextResponse.json({ data, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};

// 更新某一查询语句信息
export const PATCH = async (req: NextRequest) => {
	const { uri, collectionName, query, field, tag, username, index } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const queries = user.queries;
		const hasExistedIndex = queries.findIndex((q: any) => q.tag === tag);
		// 如果有相同的查询tag提示无法更新，保证tag名称的唯一性
		if (hasExistedIndex > -1 && hasExistedIndex !== index) {
			return NextResponse.json({ status: 202, data: [hasExistedIndex, index] });
		}
		queries[index] = {
			uri,
			collectionName,
			query,
			field,
			tag,
		};
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// 删除某一查询语句信息
export const DELETE = async (req: NextRequest) => {
	const { rows, username } = await req.json();
	try {
		await dbConnect();
		await UserModel.updateOne({ username }, { $set: { queries: rows } });
		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.log(error);
		throw error;
	}
};
