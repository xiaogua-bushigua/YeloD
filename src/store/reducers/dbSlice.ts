import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IDatabaseInfo {
	collections: Array<{
		name: string;
		options: {
			count: number;
			storageSize: number;
		};
	}>;
	dbStats: {
		db: string;
		storageSize: number;
	};
}

export interface IDb {
	database: string[];
	info: Array<IDatabaseInfo>;
	databaseIndex: number;
	collectionIndex: number;
}

const initialState: IDb = {
	database: [''],
	info: [
		// {
		// 	collections: [],
		// 	dbStats: {
		// 		db: '',
		// 		storageSize: 0,
		// 	},
		// },
	],
	databaseIndex: 0,
	collectionIndex: 0,
};

export const fetchDatabaseInfo = createAsyncThunk('dbInfo', async (uris: string[]) => {
	const data = await fetch('/api/dbInfo', {
		method: 'POST',
		body: JSON.stringify({ uris }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return data.json();
});

const dbSlice = createSlice({
	name: 'db',
	initialState,
	reducers: {
		// 保存数据库链接
		saveDbLinks: (state, { payload }) => {
			state.database = payload;
		},
		// 保存数据库index，或者collection index
		saveDataPath: (state, { payload }) => {
			if (payload.databaseIndex) state.databaseIndex = payload.databaseIndex;
			else state.collectionIndex = payload.collectionIndex;
		},
	},
	extraReducers(builder) {
		// 保存数据库信息
		builder.addCase(fetchDatabaseInfo.fulfilled, (state, action) => {
			state.info = action.payload.info;
		});
	},
});

const dbReducer = dbSlice.reducer;

export default dbReducer;
export const { saveDbLinks, saveDataPath } = dbSlice.actions;
