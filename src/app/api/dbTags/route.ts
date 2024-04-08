import dbConnect from '@/lib/mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { UserModel } from '@/lib/models';

export const PATCH = async (req: NextRequest) => {
	const { uri, collectionName, query, field, tag, username } = await req.json();
	try {
		await dbConnect();
		const user = await UserModel.findOne({ username });
		const queries = user.queries;
		queries.forEach((ele: any) => {
			if (ele.uri === uri && ele.collectionName === collectionName && ele.query === query) {
				ele.field = field;
				ele.tag = tag;
			}
		});
		await UserModel.updateOne({ username }, { $set: { queries } });
		return NextResponse.json({ status: 200 });
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const DELETE = async (req: NextRequest) => {
  const { rows, username } = await req.json();
  try {
    await dbConnect();
    console.log(rows);
    
    await UserModel.updateOne({ username }, { $set: { queries: rows } });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}