import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI not defined');

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(uri?: string) {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose.connect(uri || MONGODB_URI!, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		console.error('Error connecting to database:', error);
		throw error;
	}

	return cached.conn;
}

export default dbConnect;
