import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/app';

export const store = configureStore({
  reducer: {
   app: appReducer
  },
});

// 推导出 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;