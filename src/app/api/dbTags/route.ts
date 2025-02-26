import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { ICharts, IQuery, UserModel } from '@/lib/models';
import dbConnectPublic from '@/lib/mongodb_public';
import { transferQuery } from '@/lib/transferQuery';
import { PrismaClient, Prisma } from '@prisma/client';
import { getFieldData } from '@/lib/getFieldData';

// 获取查询语句对应文档的某一字段data
export const POST = async (req: NextRequest) => {
	const { uri, collectionName, tableName, query, field, method } = await req.json();
	try {
		const array = await getFieldData(uri, collectionName, tableName, query, field, method);
		return NextResponse.json({ data: array, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 获取所有的tag标签和该标签对应的data
export const GET = async (req: NextRequest) => {
	try {
		await dbConnect();
		const username = req.nextUrl.searchParams.get('username');
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		const data = await Promise.all(
			queries.queries.map(async (query: any) => {
				try {
					if (query.uri.includes('mongodb')) {
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
					} else if (query.uri.includes('mysql')) {
						const dynamicDbConfig = {
							datasources: {
								db: {
									url: query.uri,
								},
							},
						};
						const prisma = new PrismaClient(dynamicDbConfig);
						let array = (await prisma.$queryRaw`SELECT * FROM ${Prisma.sql([
							query.tableName!,
						])} ${Prisma.sql([query])}`) as any[];
						array = array?.map((arr) => arr[query.field]);
						await prisma.$disconnect();
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
		if (uri.includes('mongodb')) queries[index].collectionName = collectionName;
		else if (uri.includes('mysql')) queries[index].tableName = tableName;
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
