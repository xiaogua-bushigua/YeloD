import { UserModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
	try {
		dbConnect();
		const body = await req.json();
		const user = await UserModel.findOne({ username: body.username });
		const links = user.databases.links;
		return NextResponse.json({ data: links, status: 200 });
	} catch (err) {
		console.log(err);
		throw new Error('Failed to fetch the user!');
	}
};

export const PATCH = async (req: NextRequest) => {
	try {
		dbConnect();
		const body = await req.json();
		await UserModel.updateOne({ username: body.username }, { $set: { databases: { links: body.links } } });
		return NextResponse.json({ status: 200 });
	} catch (err) {
		console.log(err);
		throw new Error('Failed to fetch the user!');
	}
};
