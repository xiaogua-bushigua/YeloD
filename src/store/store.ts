import { configureStore, combineReducers } from '@reduxjs/toolkit';
import dbReducer from './reducers/dbSlice';
import authReducer from './reducers/authSlice';
import chartReducer from './reducers/chartSlice';
import screenReducer from './reducers/screenSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// 持久化状态管理配置
const persistConfig = {
	key: 'root',
	storage: storage,
	// blacklist: [''],
};

export const rootReducers = combineReducers({
	db: dbReducer,
	auth: authReducer,
	chart: chartReducer,
	screen: screenReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			// 拦截 Redux 中的 action，以下 action types 将被忽略不进行序列化检查
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
