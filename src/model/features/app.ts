import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  globalLoading:false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },

    showLoading(state) {
      state.globalLoading = true;
    },
    hideLoading(state) {
      state.globalLoading = false;
    },
  },
});

export const { increment, decrement, incrementByAmount,showLoading ,hideLoading} = appSlice.actions;
export default appSlice.reducer;
