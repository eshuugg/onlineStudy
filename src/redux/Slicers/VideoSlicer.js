import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
  freeVideoData: null,
  purchaseVideoData: null,
  loading: false,
  error: null,
};

export const videoDataSlice = createSlice({
  name: 'userLoginDetails',
  initialState,
  reducers: {
    freeVideoLoading: state => {
      state.freeVideoData = null;
      state.loading = true;
      state.error = null;
    },
    freeVideoSuccess: (state, {payload}) => {
      state.freeVideoData = payload;
      state.loading = false;
      state.error = null;
    },
    freeVideoError: (state, {payload}) => {
      state.freeVideoData = null;
      state.loading = false;
      state.error = payload;
    },
    purchaseVideoLoading: state => {
      state.purchaseVideoData = null;
      state.loading = true;
      state.error = null;
    },
    purchaseVideoSuccess: (state, {payload}) => {
      state.purchaseVideoData = payload;
      state.loading = false;
      state.error = null;
    },
    purchaseVideoError: (state, {payload}) => {
      state.purchaseVideoData = null;
      state.loading = false;
      state.error = payload;
    },
  },
});

// Export actions
export const {
  freeVideoLoading,
  freeVideoSuccess,
  freeVideoError,
  purchaseVideoLoading,
  purchaseVideoSuccess,
  purchaseVideoError,
} = videoDataSlice.actions;

// Export reducer
export default videoDataSlice.reducer;

// Async action for user login
export const freeVideoDetails = () => async dispatch => {
  //   console.log('userDetails', userDetails);
  try {
    dispatch(freeVideoLoading());
    const {data} = await axiosInstance.get(`Course/GetVideoIsFree`);
    console.log('data', data);
    if (data) {
      dispatch(freeVideoSuccess(data));
      return data;
    } else {
      dispatch(freeVideoError('No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(freeVideoError(err.message || 'failed'));
  }
};

export const purchaseVideoDetails = () => async dispatch => {
  //   console.log('userDetails', userDetails);
  try {
    dispatch(purchaseVideoLoading());
    const {data} = await axiosInstance.get(`Course/GetVideoIsPurchase`);
    console.log('data', data);
    if (data) {
      dispatch(purchaseVideoSuccess(data));
      return data;
    } else {
      dispatch(purchaseVideoError('No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(purchaseVideoError(err.message || 'failed'));
  }
};
