import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import destinationsReducer from './destinationsSlice';
import favouritesReducer from './favouritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationsReducer,
    favourites: favouritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;