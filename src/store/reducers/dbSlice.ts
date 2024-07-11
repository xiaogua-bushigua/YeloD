import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IDatabaseInfo {
	collections?: Array<{
		name: string;
		options: {
			count: number;
			storageSize: number;
		};
	}>;
	tables?: Array<{
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
	type: string;
}

export interface IDb {
	database: string[];
	info: Array<IDatabaseInfo>;
	// 所处的数据库的下标
	databaseIndex: number;
	InnerIndex: number;
}

const initialState: IDb = {
	database: [''],
	info: [],
	databaseIndex: 0,
	InnerIndex: 0,
};

export const fetchDatabaseInfo = createAsyncThunk('dbInfo', async (uris: string[]) => {
	const urisParam = encodeURIComponent(JSON.stringify(uris));
	try {
		const data = await fetch(`/api/dbInformation?uris=${urisParam}`, {
			method: 'GET',
		});
		return data.json();
	} catch (error) {
		console.log('Error fetching database info:', error);
		return { info: [] };
	}
});

const dbSlice = createSlice({
	name: 'db',
	initialState,
	reducers: {
		// 保存数据库链接
		saveDbLinks: (state, { payload }) => {
			state.database = payload;
		},
		setDatabaseIndex: (state, { payload }) => {
			state.databaseIndex = payload;
		},
		setInnerIndex: (state, { payload }) => {
			state.InnerIndex = payload;
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
export const { saveDbLinks, setDatabaseIndex, setInnerIndex } = dbSlice.actions;
