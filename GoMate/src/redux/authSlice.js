import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // ADD THIS NEW REDUCER
    restoreSession: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  restoreSession, // EXPORT THIS
} = authSlice.actions;

// Async thunks
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      
      dispatch(loginSuccess({
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        token: data.token,
      }));
    } else {
      dispatch(loginFailure(data.message || 'Login failed'));
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    
    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      const token = 'dummy-token-' + Date.now();
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      
      dispatch(registerSuccess({
        user: data,
        token: token,
      }));
    } else {
      dispatch(registerFailure('Registration failed'));
    }
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
    try {
      // Remove all stored data
      await AsyncStorage.multiRemove(['userToken', 'userData', '@favourites']);
      
      // Dispatch logout action to reset Redux state
      dispatch(logout());
      
      return Promise.resolve(); // Ensure the promise resolves
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout even if AsyncStorage fails
      dispatch(logout());
      return Promise.reject(error);
    }
  };

// ADD THIS NEW THUNK - Restore session from AsyncStorage
export const restoreUserSession = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      dispatch(restoreSession({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: token,
      }));
    }
  } catch (error) {
    console.error('Error restoring session:', error);
  }
};

export default authSlice.reducer;
