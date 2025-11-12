import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@favourites';

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setFavourites: (state, action) => {
      state.items = action.payload;
    },
    addFavourite: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavourite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFavourites: (state) => {
      state.items = [];
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;

export const loadFavourites = () => async (dispatch) => {
  try {
    const favouritesJson = await AsyncStorage.getItem(FAVOURITES_KEY);
    if (favouritesJson) {
      const favourites = JSON.parse(favouritesJson);
      dispatch(setFavourites(favourites));
    }
  } catch (error) {
    console.error('Error loading favourites:', error);
  }
};

export const toggleFavourite = (destination) => async (dispatch, getState) => {
  try {
    const { favourites } = getState();
    const isFavourite = favourites.items.some(item => item.id === destination.id);
    
    if (isFavourite) {
      dispatch(removeFavourite(destination.id));
      const updatedFavourites = favourites.items.filter(item => item.id !== destination.id);
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
    } else {
      dispatch(addFavourite(destination));
      const updatedFavourites = [...favourites.items, destination];
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
    }
  } catch (error) {
    console.error('Error toggling favourite:', error);
  }
};

export default favouritesSlice.reducer;