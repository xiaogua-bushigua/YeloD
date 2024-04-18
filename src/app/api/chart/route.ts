import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { UserModel } from '@/lib/models';

export const PATCH = async (req: NextRequest) => {
	const { chartInfo, username } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts || [];
		charts.push(chartInfo);
		await UserModel.updateOne({ username }, { $set: { charts } });
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
		const charts = user.charts || [];
		return NextResponse.json({ data: charts, status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
};
