import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/lib/models';

// 获取所有的查询语句信息
export const GET = async (req: NextRequest) => {
	try {
		await dbConnect();
		const username = req.nextUrl.searchParams.get('username');
		const queries = await UserModel.findOne({ username }, { queries: 1 });
		return NextResponse.json({ queries, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 向管理员数据库更新用户保存的查询语句，并初始化一些字段
export const PATCH = async (req: NextRequest) => {
	try {
		await dbConnect();
		let { queryObj, username } = await req.json();
		queryObj.field = '';
		queryObj.tag = '';
		queryObj.method = 'none';
		let { queries } = await UserModel.findOne({ username }, { queries: 1 });
		queries = [...queries, queryObj];
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500, error }, { status: 500 });
	}
};
