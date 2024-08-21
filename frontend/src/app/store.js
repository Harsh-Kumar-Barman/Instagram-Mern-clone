// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import userDetailReducer from '../features/userDetail/userDetailsSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, userDetailReducer);

// const store = configureStore({
//   reducer: {
//     counter: persistedReducer,
//   },
// });

// export const persistor = persistStore(store);
// export default store;


// store.js
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

// Selectors (optional in a separate file)
// Use selectors instead of getUser and getSelectedPost reducers
// export const selectUserDetails = (state) => state.user.userDetails;
// export const selectSelectedPost = (state) => state.user.selectedPost;
