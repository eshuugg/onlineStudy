import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
  freeLiveClassData: null,
  purchaseLiveClassData: null,
  loading: false,
  error: null,
};

export const classDataSlice = createSlice({
  name: 'classDetails',
  initialState,
  reducers: {
    freeLiveClassLoading: state => {
      state.freeLiveClassData = null;
      state.loading = true;
      state.error = null;
    },
    freeLiveClassSuccess: (state, { payload }) => {
      state.freeLiveClassData = payload;
      state.loading = false;
      state.error = null;
    },
    freeLiveClassError: (state, { payload }) => {
      state.freeLiveClassData = null;
      state.loading = false;
      state.error = payload;
    },
    purchaseLiveClassLoading: state => {
      state.purchaseLiveClassData = null;
      state.loading = true;
      state.error = null;
    },
    purchaseLiveClassSuccess: (state, { payload }) => {
      state.purchaseLiveClassData = payload;
      state.loading = false;
      state.error = null;
    },
    purchaseLiveClassError: (state, { payload }) => {
      state.purchaseLiveClassData = null;
      state.loading = false;
      state.error = payload;
    },
  },
});

// Export actions
export const {
  freeLiveClassLoading,
  freeLiveClassSuccess,
  freeLiveClassError,
  purchaseLiveClassLoading,
  purchaseLiveClassSuccess,
  purchaseLiveClassError,
} = classDataSlice.actions;

// Export reducer
export default classDataSlice.reducer;

// Async action for user login
export const freeLiveClassDetails = () => async dispatch => {
  try {
    dispatch(freeLiveClassLoading());
    const { data } = await axiosInstance.get(`Course/GetLiveClassIsFree`);
    console.log('data', data);
    if (data) {
      dispatch(freeLiveClassSuccess(data));
      return data;
    } else {
      dispatch(freeLiveClassError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(freeLiveClassError(err.message || 'Login failed'));
  }
};

export const purchaseLiveClassDetails = () => async dispatch => {
  try {
    dispatch(purchaseLiveClassLoading());
    const { data } = await axiosInstance.get(`/Course/GetGetLiveClassIsPurchase`);
    console.log('data', data);
    if (data) {
      dispatch(purchaseLiveClassSuccess(data));
      return data;
    } else {
      dispatch(purchaseLiveClassError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(purchaseLiveClassError(err.message || 'Login failed'));
  }
};
