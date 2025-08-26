import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
  otherCourseData: null,
  courseData: null,
  orderData: null,
  orderCheck: null,
  loading: false,
  error: null,
};

export const otherCourseDataSlice = createSlice({
  name: 'otherCourseDetailsData',
  initialState,
  reducers: {
    otherDataLoading: state => {
      state.otherCourseData = null;
      state.loading = true;
      state.error = null;
    },
    otherDataSuccess: (state, { payload }) => {
      state.otherCourseData = payload;
      state.loading = false;
      state.error = null;
    },
    otherDataError: (state, { payload }) => {
      state.otherCourseData = null;
      state.loading = false;
      state.error = payload;
    },
    courseDataLoading: state => {
      state.courseData = null;
      state.loading = true;
      state.error = null;
    },
    courseDataSuccess: (state, { payload }) => {
      state.courseData = payload;
      state.loading = false;
      state.error = null;
    },
    courseDataError: (state, { payload }) => {
      state.courseData = null;
      state.loading = false;
      state.error = payload;
    },
    orderDataLoading: state => {
      state.orderData = null;
      state.loading = true;
      state.error = null;
    },
    orderDataSuccess: (state, { payload }) => {
      state.orderData = payload;
      state.loading = false;
      state.error = null;
    },
    orderDataError: (state, { payload }) => {
      state.orderData = null;
      state.loading = false;
      state.error = payload;
    },
    orderDataCheckLoading: state => {
      state.orderCheck = null;
      state.loading = true;
      state.error = null;
    },
    orderDataCheckSuccess: (state, { payload }) => {
      state.orderCheck = payload;
      state.loading = false;
      state.error = null;
    },
    orderDataCheckError: (state, { payload }) => {
      state.orderCheck = null;
      state.loading = false;
      state.error = payload;
    },
  },
});

// Export actions
export const {
  otherDataLoading,
  otherDataSuccess,
  otherDataError,
  courseDataLoading,
  courseDataSuccess,
  courseDataError,
  orderDataLoading,
  orderDataSuccess,
  orderDataError,
  orderDataCheckLoading,
  orderDataCheckSuccess,
  orderDataCheckError
} = otherCourseDataSlice.actions;

// Export reducer
export default otherCourseDataSlice.reducer;

// Async action for user login
export const otherCourseDta = () => async dispatch => {
  try {
    dispatch(otherDataLoading());
    const { data } = await axiosInstance.get(`Course/GetAllCourseIsFree`);
    console.log('data', data);
    if (data) {
      dispatch(otherDataSuccess(data));
      return data;
    } else {
      dispatch(otherDataError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(otherDataError(err.message || 'Login failed'));
  }
};

export const courseData = id => async dispatch => {
  try {
    dispatch(courseDataLoading());
    const { data } = await axiosInstance.get(`Course/GetCourseDetails/${id}`);
    console.log('data', data);
    if (data) {
      dispatch(courseDataSuccess(data));
      return data;
    } else {
      dispatch(courseDataError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(courseDataError(err.message || 'Login failed'));
  }
};


export const orderCreate = id => async dispatch => {
  console.log('id', id)
  try {
    dispatch(orderDataLoading());
    const { data } = await axiosInstance.post(`Order/Create`, id);
    console.log('data=--=-=-=->>>>', data);
    if (data) {
      dispatch(orderDataSuccess(data));
      return data;
    } else {
      dispatch(orderDataError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(orderDataError(err.message || 'Login failed'));
  }
};

export const orderSuccessCheck = dta => async dispatch => {
  console.log('dta', dta)
  try {
    dispatch(orderDataCheckLoading());
    const { data } = await axiosInstance.post(`Order/Transaction`, dta);
    console.log('data=--=-=-=->>>>', data);
    if (data) {
      dispatch(orderDataCheckSuccess(data));
      return data;
    } else {
      dispatch(orderDataCheckError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(orderDataCheckError(err.message || 'Login failed'));
  }
};