/***
 * 页面相关逻辑处理
 * @description: 逻辑处理
 */

import { intl } from "./normal";
import map from "./map";

/**屏蔽会员 */
export const stopLcUrl = (url:string) => {
  const isLc = url.indexOf('shopName') > -1
  return isLc ? true : false
}

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