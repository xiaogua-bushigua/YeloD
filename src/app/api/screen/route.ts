import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { UserModel } from '@/lib/models';
import { IChartsInfo, IScreens } from '@/lib/models';
import { newICharts } from '@/store/reducers/screenSlice';

// 更新screen信息
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
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500, error }, { status: 500 });
	}
};

// 获取所有的screens
export const GET = async (req: NextRequest) => {
	const username = req.nextUrl.searchParams.get('username');
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const screens = user.screens || [];
		return NextResponse.json({ data: screens, status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500, error }, { status: 500 });
	}
};

// 初始化抽屉里待勾选的图表列表
export const POST = async (req: NextRequest) => {
	const { username, chartsInfo } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts;
		let data = [] as any;

		charts.forEach((chart: newICharts) => {
			data.push({
				chartName: chart.chartName,
				chartType: chart.chartType,
				option: chart.option,
				selectedTags: chart.selectedTags,
				img: chart.img,
				_id: chart._id,
				checked: false,
				left: 0,
				top: 0,
				width: '300px',
				height: '240px',
			});
		});

		data.forEach((chart: newICharts) => {
			const index = chartsInfo.findIndex((info: IChartsInfo) => info.chartId === chart._id.toString());
			if (index > -1) {
				chart.checked = true;
				if (chartsInfo[index].geometry) {
					chart.left = chartsInfo[index].geometry.left || 0;
					chart.top = chartsInfo[index].geometry.top || 0;
					chart.width = chartsInfo[index].geometry.width || '300px';
					chart.height = chartsInfo[index].geometry.height || '240px';
				}
			}
		});
		return NextResponse.json({ data, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500, error }, { status: 500 });
	}
};

// 删除screen
export const DELETE = async (req: NextRequest) => {
	const { screenId, username } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const screens = user.screens;
		const newScreens = screens.filter((screen: IScreens) => screen._id.toString() !== screenId);
		await UserModel.updateOne({ username }, { $set: { screens: newScreens } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		NextResponse.json({ status: 500, error }, { status: 500 });
	}
};
