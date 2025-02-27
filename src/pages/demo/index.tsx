import { forwardRef, useEffect } from 'react';
import createErrorBoundary from '@/pages/layouts';
import styles from './index.module.less';
import { View } from '@tarojs/components';
import { useDidHide, useDidShow, usePullDownRefresh, useReady } from '@tarojs/taro';

const Index = forwardRef(() => {
  // 可以使用所有的 React Hooks
  useEffect(() => { })

  // 对应 onReady
  useReady(() => { })

  // 对应 onShow
  useDidShow(() => { })

  // 对应 onHide
  useDidHide(() => { })

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Hooks】
  usePullDownRefresh(() => { })

  return <View className={styles.container}></View>
})
export default createErrorBoundary(Index);
