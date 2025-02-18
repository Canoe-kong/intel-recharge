import Taro from '@tarojs/taro';
import utils from '@/utils';

export const cacheKey = {
  SESSION_KEY: 'sessionKey',
  IS_IPHONE_X: 'isIphoneX',
  OPEN_ID: 'openId',
  PHONE_SYSTEM: 'phoneSystem',
  USERINFO: 'userInfo',
  ACCESS_TOKEN: 'accessToken',
  SUB_MES: 'subscribeMessage',
  ORDER_NO: 'orderNo',
  MY_LOCATION: 'my_location',
  DEVICE_ID: 'deviceId',
  SCAN: 'scan',
  AUTH_LOCATION_TO_ALI: 'authLocationToAli',
  CUR_ENV: 'curEnv',
  INTL: 'intl',
  REFRESH_TOKEN: 'refreshToken',
  BASE_PATH: 'basePath',
  BASE_CONFIG: 'baseConfig',
  LOCK: 'lock',
  CODE: 'code'
};

export const cache = {
  /**key:当前 storage 中所有的 key
   * data:	需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。
   * isAsync:是否异步
   */
  set(key: string, data: any, isAsync = false) {
    try {
      if (isAsync) {
        utils.promisify(
          Taro.setStorage({
            key: key,
            data: data
          })
        );
      } else {
        /**Taro.setStorage 的同步版本 */
        Taro.setStorageSync(key, data);
      }
    } catch (error) {
      console.log('cache set error', error);
    }
  },
  get(key: string) {
    try {
      return Taro.getStorageSync(key);
    } catch (error) {
      console.log('cache get error', error);
    }
  },
  /**删除指定的 key */
  remove(key: string) {
    try {
      Taro.removeStorageSync(key);
    } catch (error) {
      console.log('cache remove error', error);
    }
  },
  removeAll() {
    try {
      Taro.clearStorageSync();
    } catch (error) {
      console.log('cache removeAll error', error);
    }
  }
};
