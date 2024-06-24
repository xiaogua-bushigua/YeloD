import { UserModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';

// 访问管理员数据库，获取对应用户的公共数据库链接
export const GET = async (req: NextRequest) => {
	const usernameString = req.nextUrl.searchParams.get('username');
	if (!usernameString) {
		return NextResponse.json({ info: [], status: 400, error: 'No username provided' }, { status: 400 });
	}
	try {
		const username = JSON.parse(decodeURIComponent(usernameString));
		await dbConnect();
		const user = await UserModel.findOne(username);
		const links = user.databases.links;
		return NextResponse.json({ data: links, status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

// 更新用户保存的公共数据库链接
export const PATCH = async (req: NextRequest) => {
	try {
		await dbConnect();
		const body = await req.json();
		await UserModel.updateOne({ username: body.username }, { $set: { databases: { links: body.links } } });
		return NextResponse.json({ status: 200 }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};
