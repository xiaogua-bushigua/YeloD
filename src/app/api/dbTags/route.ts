import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { ICharts, IQuery, UserModel } from '@/lib/models';
import dbConnectPublic from '@/lib/mongodb_public';
import { transferQuery } from '@/lib/transferQuery';
import { PrismaClient, Prisma } from '@prisma/client';
import { postProcessing } from '@/lib/post-processing';

export const getFieldData = async (
	uri: string,
	collectionName: string,
	tableName: string,
	query: string,
	field: string,
	method: string
) => {
	let array;
	try {
		if (uri.split('://')[0] === 'mongodb') {
			const { db, client } = await dbConnectPublic(uri);
			const collection = db.collection(collectionName);
			const ql = transferQuery(query);
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
		} else {
			const dynamicDbConfig = {
				datasources: {
					db: {
						url: uri,
					},
				},
			};
			const prisma = new PrismaClient(dynamicDbConfig);
			array = (await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(tableName!)} ${Prisma.raw(query)}`) as any[];
			array = array.map((arr) => arr[field]);
		}
		array = postProcessing(array!, method);
		return array;
	} catch (error) {
		console.log(error);
		return [];
	}
};

// 获取查询语句对应文档的某一字段合集
export const POST = async (req: NextRequest) => {
	let array;
	const { uri, collectionName, tableName, query, field, method } = await req.json();
	try {
		// if (uri.split('://')[0] === 'mongodb') {
		// 	const { db, client } = await dbConnectPublic(uri);
		// 	const collection = db.collection(collectionName);
		// 	const ql = transferQuery(query);
		// 	if (ql.type === 'all') {
		// 		array = await collection
		// 			.find()
		// 			.project({ _id: 0, [field]: 1 })
		// 			.toArray();
		// 	} else if (ql.type === 'filtered') {
		// 		let queryBuilder = collection.find(ql.find);
		// 		if (ql.sort) queryBuilder = queryBuilder.sort(ql.sort);
		// 		if (ql.limit) queryBuilder = queryBuilder.limit(ql.limit);
		// 		array = await queryBuilder.project({ _id: 0, [field]: 1 }).toArray();
		// 	}
		// 	client.close();
		// 	array = array?.map((arr) => arr[field]);
		// } else {
		// 	const dynamicDbConfig = {
		// 		datasources: {
		// 			db: {
		// 				url: uri,
		// 			},
		// 		},
		// 	};
		// 	const prisma = new PrismaClient(dynamicDbConfig);
		// 	array = (await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(tableName!)} ${Prisma.raw(query)}`) as any[];
		// 	array = array.map((arr) => arr[field]);
		// }
		// array = postProcessing(array!, method);
		const array = await getFieldData(uri, collectionName, tableName, query, field, method);
		return NextResponse.json({ data: array, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 获取所有的tag标签和该标签对应的查询信息
export const GET = async (req: NextRequest) => {
	try {
		await dbConnect();
		const username = req.nextUrl.searchParams.get('username');
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		const data = await Promise.all(
			queries.queries.map(async (query: any) => {
				try {
					if (query.uri.split('://')[0] === 'mongodb') {
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
					} else {
						const dynamicDbConfig = {
							datasources: {
								db: {
									url: query.uri,
								},
							},
						};
						const prisma = new PrismaClient(dynamicDbConfig);
						let array = (await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(query.tableName!)} ${Prisma.raw(
							query
						)}`) as any[];
						array = array?.map((arr) => arr[query.field]);
						return {
							tag: query.tag,
							data: array,
						};
					}
				} catch (error) {
					return { error: `Error processing query: ${error}` };
				}
			})
		);
		return NextResponse.json({ data, status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 更新某一查询语句信息
export const PATCH = async (req: NextRequest) => {
	const { uri, query, field, tag, username, index, collectionName, tableName, method } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const queries = user.queries;
		const hasExistedIndex = queries.findIndex((q: any) => q.tag === tag);
		// 如果有相同的查询tag提示无法更新，保证tag名称的唯一性
		if (hasExistedIndex > -1 && hasExistedIndex !== index) {
			return NextResponse.json({ status: 202, data: [hasExistedIndex, index] }, { status: 202 });
		}
		queries[index] = {
			uri,
			query,
			field,
			tag,
			method,
		} as IQuery;
		if (uri.split('://')[0] === 'mongodb') queries[index].collectionName = collectionName;
		else queries[index].tableName = tableName;
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 删除某一查询语句信息
export const DELETE = async (req: NextRequest) => {
	const { tag, username } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		let charts = user.charts || [];
		if (charts.length) {
			const chart = charts.filter((chart: ICharts) => {
				if (chart.selectedTags.findIndex((item) => item.tag === tag) > -1) {
					return true;
				}
			});
			if (chart.length) {
				return NextResponse.json({ data: chart[0].chartName, status: 202 }, { status: 202 });
			}
		}
		await UserModel.updateOne({ username }, { $pull: { queries: { tag } } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};
