import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { UserModel } from '@/lib/models';
import { ICharts, IChartsInfo } from '@/lib/models';
import { newICharts } from '@/store/reducers/screenSlice';

export const PATCH = async (req: NextRequest) => {
	const { screenInfo, username, id } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const screens = user.screens || [];
		if (!id) screens.push(screenInfo);
		else {
			const index = screens.findIndex((screen: any) => screen._id.toString() === id);
			screens[index] = screenInfo;
		}
		await UserModel.updateOne({ username }, { $set: { screens } });
		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
};

export const GET = async (req: NextRequest) => {
	const username = req.nextUrl.searchParams.get('username');
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const screens = user.screens || [];
		return NextResponse.json({ data: screens, status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
};

export const POST = async (req: NextRequest) => {
	const { username, chartsInfo } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts;
		let data = [] as any;
		charts.forEach((chart: ICharts) => {
			chartsInfo.forEach((info: IChartsInfo) => {
				if (info.chartId === chart._id.toString()) {
					data.push({
						chartName: chart.chartName,
						chartType: chart.chartType,
						option: chart.option,
						selectedTags: chart.selectedTags,
						img: chart.img,
						_id: chart._id,
						checked: true,
						...info.geometry,
					});
				}
			});
		});
		return NextResponse.json({ data, status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
};
