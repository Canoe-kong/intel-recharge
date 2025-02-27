import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AppState {
  globalLoading: boolean;
  shops: any[] | null; // 显式声明联合类型
}
const initialState: AppState = {
  globalLoading: false,
  shops: null
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showLoading(state) {
      state.globalLoading = true;
    },
    hideLoading(state) {
      state.globalLoading = false;
    },
    updateShops(state, action: PayloadAction<any[]>) {
      // 使用PayloadAction定义payload类型
      state.shops = action.payload.slice(); // 简写数组拷贝
    }
  }
});

export const { showLoading, hideLoading, updateShops } = appSlice.actions;
export default appSlice.reducer;
