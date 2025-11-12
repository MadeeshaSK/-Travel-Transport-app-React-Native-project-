import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import destinationsReducer from './destinationsSlice';
import favouritesReducer from './favouritesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationsReducer,
    favourites: favouritesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false, // Add this for better performance
    }),
});

// Add this to debug state changes
store.subscribe(() => {
  const state = store.getState();
  console.log('🔵 Store updated - isAuthenticated:', state.auth.isAuthenticated);
});

export default store;