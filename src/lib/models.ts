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

export interface IChartsInfo {
	chartId: string;
	geometry: {
		left: string;
		top: string;
		width: string;
		height: string;
	};
}

export interface IScreens {
	screenName: string;
	background: string;
	title: string;
	ratio: string;
	staticInterval: number;
	dynamicInterval: number;
	screenImg: string;
	_id: string;
	chartsInfo: Array<IChartsInfo>;
}

export interface IQuery {
	uri: string;
	collectionName?: string;
	tableName?: string;
	query: string;
	field?: string;
	tag?: string;
	_id?: string;
}

interface IUser {
	username: string;
	password?: string;
	avatar?: string;
	databases: {
		links: string[];
	};
	queries: Array<IQuery>;
	charts: Array<ICharts>;
	screens: Array<IScreens>;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	password: { type: String },
	avatar: { type: String },
	databases: { type: Object, required: true },
	queries: [
		{
			uri: { type: String, required: true },
			collectionName: { type: String, required: false },
			tableName: { type: String, required: false },
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
	screens: [
		{
			screenName: { type: String, required: true },
			background: { type: String, required: true },
			title: { type: String, required: true },
			ratio: { type: String, required: true },
			staticInterval: { type: Number, required: true },
			dynamicInterval: { type: Number, required: true },
			screenImg: { type: String, required: true },
			chartsInfo: { type: Array, required: true },
		},
	],
});

export const UserModel = models.User || model('User', userSchema);
