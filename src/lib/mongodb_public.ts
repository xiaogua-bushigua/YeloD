import { MongoClient } from 'mongodb';

const dbConnectPublic = async (uri: string) => {
	try {
		const client = await MongoClient.connect(uri);
		const db = client.db();
		return { db, client };
	} catch (error) {
		console.error('Error connecting to database:', error);
		throw error;
	}
};

export default dbConnectPublic;
