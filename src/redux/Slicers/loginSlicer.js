import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
  authData: null,
  registerData: null,
  resentOtpData: null,
  verifyOtpData: null,
  forgetPasswordData: null,
  loading: false,
  error: null,
};

export const userLoginDataSlice = createSlice({
  name: 'userLoginDetails',
  initialState,
  reducers: {
    authLoading: state => {
      state.authData = null;
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, { payload }) => {
      state.authData = payload;
      state.loading = false;
      state.error = null;
    },
    authError: (state, { payload }) => {
      state.authData = null;
      state.loading = false;
      state.error = payload;
    },
    registerLoading: state => {
      state.registerData = null;
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, { payload }) => {
      state.registerData = payload;
      state.loading = false;
      state.error = null;
    },
    registerError: (state, { payload }) => {
      state.registerData = null;
      state.loading = false;
      state.error = payload;
    },
    resentOtpLoading: state => {
      state.resentOtpData = null;
      state.loading = true;
      state.error = null;
    },
    resentOtpSuccess: (state, { payload }) => {
      state.resentOtpData = payload;
      state.loading = false;
      state.error = null;
    },
    resentOtpError: (state, { payload }) => {
      state.resentOtpData = null;
      state.loading = false;
      state.error = payload;
    },
    verifyOtpLoading: state => {
      state.verifyOtpData = null;
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess: (state, { payload }) => {
      state.verifyOtpData = payload;
      state.loading = false;
      state.error = null;
    },
    verifyOtpError: (state, { payload }) => {
      state.verifyOtpData = null;
      state.loading = false;
      state.error = payload;
    },
    forgetPasswordLoading: state => {
      state.forgetPasswordData = null;
      state.loading = true;
      state.error = null;
    },
    forgetPasswordSuccess: (state, { payload }) => {
      state.forgetPasswordData = payload;
      state.loading = false;
      state.error = null;
    },
    forgetPasswordError: (state, { payload }) => {
      state.forgetPasswordData = null;
      state.loading = false;
      state.error = payload;
    }

  }
});

// Export actions
export const {
  authLoading,
  authSuccess,
  authError,
  registerLoading,
  registerSuccess,
  registerError,
  resentOtpLoading,
  resentOtpSuccess,
  resentOtpError,
  verifyOtpLoading,
  verifyOtpSuccess,
  verifyOtpError,
  forgetPasswordLoading,
  forgetPasswordSuccess,
  forgetPasswordError

} = userLoginDataSlice.actions;

// Export reducer
export default userLoginDataSlice.reducer;

// Async action for user login
export const userLogin = userDetails => async dispatch => {
  console.log('userDetails', userDetails);
  try {
    dispatch(authLoading());
    const { data } = await axiosInstance.post(`Account/Login`, userDetails);
    console.log('data', data);
    if (data) {
      dispatch(authSuccess(data));
      return data;
    } else {
      dispatch(authError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(authError(err.message || 'Login failed'));
  }
};

export const registerData = registerDetails => async dispatch => {
  console.log('registerDetails', registerDetails);
  try {
    dispatch(registerLoading());
    const { data } = await axiosInstance.post(`Account/Register`, registerDetails);
    console.log('data', data);
    if (data) {
      dispatch(registerSuccess(data));
      return data;
    } else {
      dispatch(registerError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(registerError(err.message || 'Login failed'));
  }
};

export const resentOtp = phoneNO => async dispatch => {
  console.log('phoneNO', phoneNO);
  try {
    dispatch(resentOtpLoading());
    const { data } = await axiosInstance.post(`Account/ResetOtp`, phoneNO);
    console.log('data', data);
    if (data) {
      dispatch(resentOtpSuccess(data));
      return data;
    } else {
      dispatch(resentOtpError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(resentOtpError(err.message || 'Login failed'));
  }
};

export const verifyOtp = verify => async dispatch => {
  console.log('verify', verify);
  try {
    dispatch(verifyOtpLoading());
    const { data } = await axiosInstance.post(`Account/OtpVerified`, verify);
    console.log('data', data);
    if (data) {
      dispatch(verifyOtpSuccess(data));
      return data;
    } else {
      dispatch(verifyOtpError('Login failed: No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(verifyOtpError(err.message || 'Login failed'));
  }
};

export const forgetPasswordDetails = dta => async dispatch => {
  console.log('dta', dta);
  try {
    dispatch(forgetPasswordLoading());
    const { data } = await axiosInstance.post(`Account/ResetPasswoard`, dta);
    console.log('data', data);
    if (data) {
      dispatch(forgetPasswordSuccess(data));
      return data;
    } else {
      dispatch(forgetPasswordError('No data received'));
    }
  } catch (err) {
    console.log('err', err);
    dispatch(forgetPasswordError(err.message || 'Login failed'));
  }
};

