import i18n from 'taro-i18n';
import {cache,cacheKey} from '@/cache';
import Taro from '@tarojs/taro';
/**
 * 将对象转为query
 * @param {Object} query
 */
export const stringifyQuery = query => {
  try {
    return Object.keys(query)
      .filter(key => query[key] !== undefined && query[key] !== null)
      .map(key => `${key}=${query[key]}`)
      .join('&');
  } catch (err) {
    return '';
  }
};

/**
 * 多语言转化
 */
export const intl = (key: string, value?: any) => {
  return i18n.t._(key, value);
};



/**
 * 统一处理异步请求
 * 避免async和await中使用try catch
 */
export function trans(promise) {
  return promise
    .then(data => {
      return data;
    })
    .catch(err => Taro.showToast({ title: err.message, icon: 'none' }));
}


/**
   * 是否是微信小程序
   */
export function isWechat() {
  return process.env.TARO_ENV === 'weapp';
}

/**
 * 是否是支付宝小程序
 */
export function isAlipay() {
  return process.env.TARO_ENV === 'alipay';
}

/**
 * 是否是H5判断
 */
export function isH5() {
  return process.env.TARO_ENV === 'h5';
}

/**检测夸克浏览器 uc浏览器 iOS设备 */
export function isQuarkBrowserOniOS() {
  const ua = navigator.userAgent.toLowerCase();
  const isQuark = ua.indexOf('quark') !== -1;
  const isUc = ua.indexOf('ucbrowser') !== -1;
  const isiOS = /iphone|ipad|ipod|ios/.test(ua);
  return isiOS && (isUc || isQuark);
}

/**检测夸克浏览器 */
export function isQuarkBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('quark') !== -1;
}

  /**判断浏览器环境 */
 export function browserEnv() {
    if (!this.isH5()) {
      return;
    }
    let browserResult = '';
    const browser = navigator.userAgent.toLowerCase();
    if (browser.match(/Alipay/i) == 'alipay') {
      console.log('支付宝app的浏览器');
      browserResult = 'alipay';
    } else if (browser.match(/MicroMessenger/i) == 'micromessenger') {
      console.log('微信app的浏览器');
      browserResult = 'wx';
    } else {
      // console.log('普通浏览器');
      browserResult = 'common';
    }
    return browserResult;
  }


  /**
   * 获取当前使用语言
   */
  export function getLanguage() {
   return cache.get(cacheKey.INTL) === 'en'
    ? 'en-US'
    : cache.get(cacheKey.INTL) === 'mo'
      ? 'zh-TW'
      : 'zh-CN';
  }

  /**
   * 获取当前客户端
   */
  export function getClient() {
    return this.isWechat() ? 'WECHAT_MP' : this.isH5() ? 'MOBILE_H5' : 'ALIPAY_MP'
  }

  /**获取当前产品类型 */
  export function getTenAntCode() {
    return this.isH5() ? 'mo_dian' : 'lc_dian';
  }

  