import { Schema, model, models } from 'mongoose';

export interface ICharts {
	chartName: string;
	chartType: string;
	option: any;
	selectedTags: Array<{
    queryIndex: number;
    tag: string;
  }>;
	img: string;
  _id: string;
}

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
	charts: Array<ICharts>;
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
	charts: [
		{
			chartName: { type: String, required: true },
			chartType: { type: String, required: true },
			option: { type: Object, required: true },
			selectedTags: { type: Array, required: true },
			img: { type: String, required: true },
		},
	],
});

export const UserModel = models.User || model('User', userSchema);
