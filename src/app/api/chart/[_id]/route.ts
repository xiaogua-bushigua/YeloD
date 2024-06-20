import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { ICharts, UserModel } from '@/lib/models';

export const GET = async (req: NextRequest, { params }: { params: { _id: string } }) => {
	const username = req.nextUrl.searchParams.get('username');
	const _id = params._id;
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const charts = user.charts || [];
		if (!charts.length) return NextResponse.json({ error: 'No Charts', status: 404 }, { status: 404 });
		const chart = charts.filter((chart: ICharts) => chart._id.toString() === _id);
		if (!chart) return NextResponse.json({ error: 'No Chart', status: 404 }, { status: 404 });
		return NextResponse.json({ data: chart[0], status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 }, { status: 500 });
	}
};
