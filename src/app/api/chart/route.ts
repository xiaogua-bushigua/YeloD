import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { ICharts, UserModel, IScreens, IChartsInfo } from '@/lib/models';
import dbConnectPublic from '@/lib/mongodb_public';
import { transferQuery } from '@/lib/transferQuery';

// 更新charts
export const PATCH = async (req: NextRequest) => {
	const { chartInfo, username, id } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts || [];
		if (!id) charts.push(chartInfo);
		else {
			const index = charts.findIndex((chart: any) => chart._id.toString() === id);
			charts[index] = chartInfo;
		}
		await UserModel.updateOne({ username }, { $set: { charts } });
		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
};

// 获取charts
export const GET = async (req: NextRequest) => {
	const username = req.nextUrl.searchParams.get('username');
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts || [];
		return NextResponse.json({ data: charts, status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
};

// 返回查询到的数据
export const POST = async (req: NextRequest) => {
	const { username, queryIndexes } = await req.json();
	try {
		await dbConnect();
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		let promises = queryIndexes.map(async (queryIndex: number) => {
			const { uri, collectionName, query, field } = queries.queries[queryIndex];
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
			return {
				queryIndex,
				data: array,
			};
		});
		const resArray = await Promise.all(promises);
		return NextResponse.json({ data: resArray, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};

// 删除chart
export const DELETE = async (req: NextRequest) => {
	const { chartId, username } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts;
		const screens = user.screens;
		let checkedIds = [] as string[];
		if (screens.length) {
			screens.forEach((screen: IScreens) => {
				if (screen.chartsInfo.length) {
					screen.chartsInfo.forEach((chart: IChartsInfo) => {
						checkedIds.push(chart.chartId);
					});
				}
			});
		}
		checkedIds = Array.from(new Set(checkedIds));
		if (checkedIds.includes(chartId)) return NextResponse.json({ status: 202 });
		else {
			const newCharts = charts.filter((chart: ICharts) => chart._id.toString() !== chartId);
			await UserModel.updateOne({ username }, { $set: { charts: newCharts } });
			return NextResponse.json({ status: 200 });
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};
