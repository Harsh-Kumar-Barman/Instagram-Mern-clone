import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // defaults to localStorage for web
import userDetailReducer from '../features/userDetail/userDetailsSlice';

const persistConfig = {
  key: 'root',  // Changed key to 'user' to match slice name
  storage,
};

const persistedReducer = persistReducer(persistConfig, userDetailReducer);

const store = configureStore({
  reducer: {
    counter: persistedReducer,  // Changed key to 'user'
  },
});

export const persistor = persistStore(store);
export default store;