import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
  freeStudyMaterialData: null,
  purchaseStudyMaterialData: null,
  loading: false,
  error: null,
};

export const classDataSlice = createSlice({
  name: 'classDetails',
  initialState,
  reducers: {
    freeStudyMaterialLoading: state => {
      state.freeStudyMaterialData = null;
      state.loading = true;
      state.error = null;
    },
    freeStudyMaterialSuccess: (state, {payload}) => {
      state.freeStudyMaterialData = payload;
      state.loading = false;
      state.error = null;
    },
    freeStudyMaterialError: (state, {payload}) => {
      state.freeStudyMaterialData = null;
      state.loading = false;
      state.error = payload;
    },
    purchaseStudyMaterialLoading: state => {
      state.purchaseStudyMaterialData = null;
      state.loading = true;
      state.error = null;
    },
    purchaseStudyMaterialSuccess: (state, {payload}) => {
      state.purchaseStudyMaterialData = payload;
      state.loading = false;
      state.error = null;
    },
    purchaseStudyMaterialError: (state, {payload}) => {
      state.purchaseStudyMaterialData = null;
      state.loading = false;
      state.error = payload;
    },
  },
});

// Export actions
export const {
  freeStudyMaterialLoading,
  freeStudyMaterialSuccess,
  freeStudyMaterialError,
  purchaseStudyMaterialLoading,
  purchaseStudyMaterialSuccess,
  purchaseStudyMaterialError,
} = classDataSlice.actions;

// Export reducer
export default classDataSlice.reducer;

// Async action for user login
export const freeStudyMaterialDetails = () => async dispatch => {
  try {
    dispatch(freeStudyMaterialLoading());
    const {data} = await axiosInstance.get(`Course/GetStudyMaterialIsFree`);
    console.log('data', data);
    if (data) {
      dispatch(freeStudyMaterialSuccess(data));
      return data;
    } else {
      dispatch(freeStudyMaterialError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(freeStudyMaterialError(err.message || 'Login failed'));
  }
};

export const purchaseStudyMaterialDetails = () => async dispatch => {
  try {
    dispatch(purchaseStudyMaterialLoading());
    const {data} = await axiosInstance.get(`/Course/GetLiveClassIsFree`);
    console.log('data', data);
    if (data) {
      dispatch(purchaseStudyMaterialSuccess(data));
      return data;
    } else {
      dispatch(purchaseStudyMaterialError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(purchaseStudyMaterialError(err.message || 'Login failed'));
  }
};
