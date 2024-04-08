import { Schema, model, models } from 'mongoose';

interface IUser {
	username: string;
	password?: string;
	avatar?: string;
	databases: {
		links: string[];
	};
	queries: Array<{
		uri: string;
		collectionName: string;
		query: string;
	}>;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	password: { type: String },
	avatar: { type: String },
	databases: { type: Object, required: true },
	queries: [
		{
			uri: { type: String, required: true },
			collectionName: { type: String, required: true },
			query: { type: String, required: true },
			field: { type: String },
			tag: { type: String },
		},
	],
});

export const UserModel = models.User || model('User', userSchema);
