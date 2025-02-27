/***
 * 页面相关逻辑处理
 * @description: 逻辑处理
 */

import { intl } from './normal';
import map from './map';
import Taro from '@tarojs/taro';
import router from '@/route';

/**屏蔽会员 */
export const stopLcUrl = (url: string) => {
  const isLc = url.indexOf('shopName') > -1;
  return isLc ? true : false;
};

/**
 * 处理店铺营业时间
 * @param openTime
 * @returns
 */
export const getOpenTime = (openTime) => {
  if (openTime) {
    openTime = JSON.parse(openTime);
    let str = '';
    openTime.forEach((time, index) => {
      const { weekStart, weekEnd, startTime, endTime } = time;
      let strItem = `${weekStart} - ${weekEnd} ${startTime}-${endTime}`;
      index === 0 ? (str += strItem) : (str += ` | ${strItem}`);
    });
    return str;
  } else {
    return intl('allTime');
  }
};

/**处理营业时间和距离 */
export const dealShop = (shop) => {
  const shopLnLa = map.bd09togcj02(shop.shopLng, shop.shopLat);
  shop.longitude = shopLnLa[0];
  shop.latitude = shopLnLa[1];
  if (shop.distance) {
    shop.distance = Number(shop.distance);
    if (shop.distance >= 1000) {
      shop.distance = shop.distance = (shop.distance / 1000).toFixed(1) + 'km';
    } else {
      shop.distance = shop.distance = shop.distance.toFixed(0) + 'm';
    }
  }
  shop.openingHours = getOpenTime(shop.openingHours);
  return shop;
};

/**登录成功的页面路由 */
export const handleLoginSuccess = () => {
  const pages = Taro.getCurrentPages();
  console.log('pages', pages);
  // const currentPage = pages[pages.length - 1];
  // 如果页面栈中只有一个页面，直接跳转到首页
  if (pages && pages.length && pages.length === 1) {
    console.log('==========只有一个页面，直接跳转到首页==========');
    router.reLaunch({ url: '/pages/index/index' });
    return;
  }
  const previousPage = pages[pages.length - 2];
  // 如果上一页是登录页，直接跳转到首页
  if (
    previousPage &&
    previousPage.$router &&
    previousPage.$router.path.includes('/pages/telLogin/index')
  ) {
    console.log('==========上一页是登录页，直接跳转到首页==========');
    router.reLaunch({ url: '/pages/index/index' });
    return;
  }
  // 如果页面栈中有首页，返回首页
  const hasIndexPage = pages.some(
    (page) => page.$router && page.$router.path === '/pages/index/index'
  );
  if (hasIndexPage) {
    console.log('==========返回首页==========');
    router.goBack({
      delta: pages.length - 1
    });
  } else {
    console.log('==========去到首页==========');
    router.goBack({
      delta: 1
    });
  }
};
