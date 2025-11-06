import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
    coursesData: null,
    loading: false,
    error: null,
};

export const coursesDataSlice = createSlice({
    name: 'mycourses',
    initialState,
    reducers: {
        coursesDetailsLoading: state => {
            state.coursesData = null;
            state.loading = true;
            state.error = null;
        },
        coursesDetailsSuccess: (state, { payload }) => {
            state.coursesData = payload;
            state.loading = false;
            state.error = null;
        },
        coursesDetailsError: (state, { payload }) => {
            state.coursesData = null;
            state.loading = false;
            state.error = payload;
        },

    },
});

// Export actions
export const {
    coursesDetailsLoading,
    coursesDetailsSuccess,
    coursesDetailsError

} = coursesDataSlice.actions;

// Export reducer
export default coursesDataSlice.reducer;

// Async action for user login
export const getCourses = (id) => async dispatch => {
    try {
        dispatch(coursesDetailsLoading());
        const { data } = await axiosInstance.get(`Course/GetAllDetails/${id}`);
        console.log('data', data);
        if (data) {
            dispatch(coursesDetailsSuccess(data));
            return data;
        } else {
            dispatch(coursesDetailsError('Login failed: No data received'));
        }
    } catch (err) {
        console.log('err', err);
        dispatch(coursesDetailsError(err.message || 'Login failed'));
    }
};


