import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IDatabaseInfo {
	collections: string[];
	dbStatus: {
		name: string;
		size: number;
	};
}

export interface IDb {
	database: string[];
	info: Array<IDatabaseInfo>;
}

const initialState: IDb = {
	database: [''],
	info: [
		{
			collections: [],
			dbStatus: {
				name: '',
				size: 0,
			},
		},
	],
};

export const fetchDatabaseInfo = createAsyncThunk('dbInfo', async (uris: string[]) => {  
	const data = await fetch('/api/dbInfo', {
		method: 'POST',
		body: JSON.stringify({uris}),
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
		saveDbLinks: (state, { payload }) => {
			state.database = payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchDatabaseInfo.fulfilled, (state, action) => {
			state.info = action.payload.info;
		});
	},
});

const dbReducer = dbSlice.reducer;

export default dbReducer;
export const { saveDbLinks } = dbSlice.actions;
