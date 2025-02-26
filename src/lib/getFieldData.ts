import dbConnectPublic from '@/lib/mongodb_public';
import { transferQuery } from '@/lib/transferQuery';
import { PrismaClient, Prisma } from '@prisma/client';
import { postProcessing } from '@/lib/post-processing';

let prisma: PrismaClient | null = null;

export const getFieldData = async (
	uri: string,
	collectionName: string,
	tableName: string,
	query: string,
	field: string,
	method: string
) => {
	let array;
	try {
		if (uri.includes('mongodb')) {
			const { db, client } = await dbConnectPublic(uri);
			const collection = db.collection(collectionName);
			const ql = transferQuery(query);
			if (ql.type === 'all') {
				array = await collection
					.find()
					.project({ _id: 0, [field]: 1 })
					.toArray();
			} else if (ql.type === 'filtered') {
				let queryBuilder = collection.find(ql.find);
				if (ql.sort) queryBuilder = queryBuilder.sort(ql.sort);
				if (ql.limit) queryBuilder = queryBuilder.limit(ql.limit);
				array = await queryBuilder.project({ _id: 0, [field]: 1 }).toArray();
			}
			client.close();
			array = array?.map((arr) => arr[field]);
		} else if (uri.includes('mysql')) {
			if (!prisma) {
				const dynamicDbConfig = {
					datasources: {
						db: {
							url: uri,
						},
					},
				};
				prisma = new PrismaClient(dynamicDbConfig);
			}
			array = (await prisma.$queryRaw`SELECT * FROM ${Prisma.sql([tableName!])} ${Prisma.sql([query])}`) as any[];
			array = array.map((arr) => arr[field]);
		}
		array = postProcessing(array!, method);
		return array;
	} catch (error) {
		console.log(error);
		return [];
	} finally {
		if (prisma) {
			await prisma.$disconnect();
			prisma = null;
		}
	}
};
