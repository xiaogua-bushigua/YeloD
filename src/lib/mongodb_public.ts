import { MongoClient } from 'mongodb';

let cachedDb: any = null;

const dbConnectPublic = async (uri: string) => {
	if (cachedDb) {
		return cachedDb;
	}

	try {
		const client = await MongoClient.connect(uri);
		const db = client.db();
		cachedDb = db;
		return db;
	} catch (error) {
		console.error('Error connecting to database:', error);
		throw new Error('Database connection error');
	}
}

export default dbConnectPublic;