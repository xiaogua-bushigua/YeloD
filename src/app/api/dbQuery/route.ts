import { NextResponse, NextRequest } from 'next/server';
import dbConnectPublic from '@/lib/mongodb_public';

export const POST = async (req: NextRequest) => {
	const { uri, collectionName, query } = await req.json();
	try {
		const db = await dbConnectPublic(uri);
		const collection = db.collection(collectionName);
		const data = await collection.find().toArray();
		return NextResponse.json({ data, status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 });
	}
};
