import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { ICharts, UserModel, IScreens, IChartsInfo, IQuery } from '@/lib/models';
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
		if (charts.length) {
			const i = charts.findIndex((chart: ICharts) => chart.chartName === chartInfo.chartName);
			if (i > -1) return NextResponse.json({ status: 202 });
		} else {
			const index = charts.findIndex((chart: ICharts) => chart._id.toString() === id);
			charts[index] = { ...charts[index], ...chartInfo, _id: charts[index]._id };
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

// 原地根据queries对chart的option的series数据进行更新
export const POST = async (req: NextRequest) => {
	const { username } = await req.json();
	try {
		await dbConnect();
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		const data = queries.queries.map(async (query_: IQuery) => {
			const { uri, collectionName, query, field } = query_;
			const { db, client } = await dbConnectPublic(uri);
			const collection = db.collection(collectionName);
			const ql = transferQuery(query);
			let array;
			if (ql.type === 'all') {
				array = await collection
					.find()
					.project({ _id: 0, [field as string]: 1 })
					.toArray();
			} else if (ql.type === 'filtered') {
				let queryBuilder = collection.find(ql.find);
				if (ql.sort) queryBuilder = queryBuilder.sort(ql.sort);
				if (ql.limit) queryBuilder = queryBuilder.limit(ql.limit);
				array = await queryBuilder.project({ _id: 0, [field as string]: 1 }).toArray();
			}
			client.close();
			array = array?.map((arr) => arr[field as string]);
			return array;
		});
		const res = await Promise.all(data);
		const user = await UserModel.findOne({ username });
		const charts = user.charts || [];
		charts.forEach((chart: ICharts) => {
			const containXAxis = chart.selectedTags.filter(
				(t: { xAxis?: boolean; tag: string; queryIndex: number }) => t.xAxis
			);
			if (containXAxis.length) chart.option.xAxis[0].data = res[containXAxis[0].queryIndex];
			const nonContainXAxis = chart.selectedTags.filter(
				(t: { xAxis?: boolean; tag: string; queryIndex: number }) => !t.xAxis
			);
			if (chart.chartType !== 'pie') {
				nonContainXAxis.forEach((t: { xAxis?: boolean; tag: string; queryIndex: number }, index: number) => {
					// here!!
					chart.option.series[index].data = res[t.queryIndex];
				});
			} else {
				nonContainXAxis.forEach((t: { xAxis?: boolean; tag: string; queryIndex: number }, index: number) => {
					chart.option.series[0].data[index].value = res[t.queryIndex].length;
				});
			}
		});
		await UserModel.updateOne({ username }, { $set: { charts } });
		return NextResponse.json({ status: 200 });
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
