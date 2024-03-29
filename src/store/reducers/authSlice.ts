import { createSlice } from '@reduxjs/toolkit';
import { Session, User } from 'next-auth';

const initialState: Session = {
	user: { username: '', password: '', _id: '' } as User,
  expires: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setSessionState: (state, { payload }) => {
			if(payload) state.user = payload;
		},
	},
});

const dbReducer = authSlice.reducer;

export default dbReducer;
export const { setSessionState } = authSlice.actions;
