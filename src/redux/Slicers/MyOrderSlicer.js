import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosInstance';

// Updated initial state with more generic names
const initialState = {
    orderData: null,
    loading: false,
    error: null,
};

export const classDataSlice = createSlice({
    name: 'myorders',
    initialState,
    reducers: {
        orderDetailsLoading: state => {
            state.orderData = null;
            state.loading = true;
            state.error = null;
        },
        orderDetailsSuccess: (state, { payload }) => {
            state.orderData = payload;
            state.loading = false;
            state.error = null;
        },
        orderDetailsError: (state, { payload }) => {
            state.orderData = null;
            state.loading = false;
            state.error = payload;
        },

    },
});

// Export actions
export const {
    orderDetailsLoading,
    orderDetailsSuccess,
    orderDetailsError

} = classDataSlice.actions;

// Export reducer
export default classDataSlice.reducer;

// Async action for user login
export const getOrders = () => async dispatch => {
    try {
        dispatch(orderDetailsLoading());
        const { data } = await axiosInstance.get(`Order/AllOrders`);
        console.log('data', data);
        if (data) {
            dispatch(orderDetailsSuccess(data));
            return data;
        } else {
            dispatch(orderDetailsError('Login failed: No data received'));
        }
    } catch (err) {
        console.log('err', err);
        dispatch(orderDetailsError(err.message || 'Login failed'));
    }
};


