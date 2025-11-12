import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme_mode';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDark: false,
  },
  reducers: {
    setTheme: (state, action) => {
      state.isDark = action.payload;
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

// Load theme from storage
export const loadTheme = () => async (dispatch) => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    if (theme !== null) {
      dispatch(setTheme(theme === 'dark'));
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
};

// Toggle and save theme
export const toggleThemeMode = () => async (dispatch, getState) => {
  try {
    dispatch(toggleTheme());
    const { theme } = getState();
    await AsyncStorage.setItem(THEME_KEY, theme.isDark ? 'dark' : 'light');
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export default themeSlice.reducer;