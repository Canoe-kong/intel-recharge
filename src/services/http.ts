/**
 * http请求
 */
import Taro from '@tarojs/taro';
import utils from '@/utils';
import { cache, cacheKey } from '@/cache';
import { decryptData, encryptRequestConfig } from './aes';
import event from '@/event';
import router from '@/route';
import API from './api';

interface Option {
  loading?: boolean, /**是否有loading状态 */
  loadingText?: string, /**loading状态下的文字 */
  url?: string, /**接口地址 */
  param?: object, /**参数 */
  pathParam?: object, /**接口地址中可能会有参数 []从数组中传过来 */
  method?: keyof Taro.request.Method | undefined, /**默认POST */
  type?: string, /**默认application/json */
  token?: string, /**测试用的token */
  header?: object, /**header */
  IS_AES?: boolean, /**是否加密 */
}

const IS_AES = process.env.TARO_APP_IS_AES
// 刷新 Token 的 Promise，避免多个接口同时触发刷新
let refreshPromise: Promise<any> | null = null;
// let refreshCount = 0; // 刷新次数，超过三次则退出


/**
 * 清除所有事件监听和缓存
 */
const clearAll = () => {
  event.offAll();
  cache.removeAll();
};
/**
 * http请求返回码
 */
export const Http_Result = {
  SUCCESS: '000',
  AUTH_INVALID: '001004',
  AUTH_INVALID_2: '007005',
  REFRESH_INVALID: '007004', // refreshToken失效
  ERROR: -1,
  FAIL: -2
};

/**
 * 显示加载状态
 * @param loading 
 * @param loadingText 
 * @returns 
 */
const showLoading = (loading: boolean, loadingText?: string) => {
  if (!loading) return;
  Taro.hideLoading();
  Taro.showLoading({
    title: loadingText || utils.intl('dealing'),
    mask: true
  });
};
/**
 * 清除加载状态
 * @param loading 
 * @returns 
 */
const hideLoading = (loading: boolean) => {
  if (!loading) return;
  Taro.hideLoading();
};

/**
 * 处理 Token 过期逻辑
 * @param url 
 * @param option 
 * @returns 
 */
const handleTokenInvalid = async (url: string, option: Option) => {
  if (!cache.get(cacheKey.ACCESS_TOKEN)) {
    // 没有 Token，直接跳转登录
    clearAll();
    if (window.location.href.indexOf('/pages/telLogin/index') > -1) {
      return Promise.reject(new Error('No access token'));
    }
    router.go({ url: '/pages/telLogin/index' });
    return Promise.reject(new Error('No access token'));
  }

  // 尝试刷新 Token
  try {
    const res = await refreshToken();
    const { accessToken } = res;
    cache.set(cacheKey.ACCESS_TOKEN, accessToken);
    cache.set(cacheKey.REFRESH_TOKEN, accessToken);
    // 重新发起请求
    return post(url, option);
  } catch (err) {
    console.error('Token refresh failed', err);
    clearAll();
    if (window.location.href.indexOf('/pages/telLogin/index') > -1) {
      return Promise.reject(err);
    }
    router.go({ url: '/pages/telLogin/index' });
    return Promise.reject(err);
  }
};

/**
 * 刷新token
 * @returns 
 */
export const refreshToken = (): Promise<{ appToken: string; accessToken: string }> => {
  if (refreshPromise) return refreshPromise;

  return (refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const refreshToken = cache.get(cacheKey.REFRESH_TOKEN);
      if (!refreshToken) throw new Error('No refresh token');

      const res = await post(API.REFRESH_TOKEN_H5, {
        param: {
          appKey: '77230E94B5CD88D51A839281531BLACK',
          appSecret: '77230E94B5CD88D51A839281531BLACK',
          refreshToken
        }
      });

      if (res.success) {
        resolve(res.data);
      } else {
        reject(res.data);
      }
    } catch (err) {
      clearAll();
      reject(err);
    }
  }).finally(() => {
    refreshPromise = null;
  }));
};


/**
 * 
 * @param url 
 * @param option 
 * @returns 
 */
export const request = (url: string, option: Option): Promise<{ success: boolean, data: any }> => {
  const {
    loading = false,
    loadingText,
    param = {} as { token?: string },
    method = 'POST',
    type = 'json',
    header = {},
  } = option;

  // 显示加载状态
  showLoading(loading, loadingText);

  // 设置默认 Header
  const defaultHeader = {
    'content-type': type === 'form' ? 'x-www-form-urlencoded' : 'application/json',
    clientType: utils.getClient(),
    browserEnv: utils.browserEnv(),
    'Accept-Language': utils.getLanguage(),
    'productType': '2',
    'TENANT-CODE': utils.getTenAntCode(),
    'PC': 'APP'
  };
  const finalHeader = { ...defaultHeader, ...header } as { [key: string]: any };

  // 设置 Token
  if (typeof param === 'object' && param !== null && 'token' in param && param.token) {
    finalHeader.token = param.token;
  } else if (cache.get(cacheKey.ACCESS_TOKEN)) {
    finalHeader.accessToken = cache.get(cacheKey.ACCESS_TOKEN);
  }

  // 加密请求配置
  const { header: encryptHeader, data } = encryptRequestConfig(option, finalHeader, param, IS_AES);

  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      data,
      method,
      header: encryptHeader,
      success: async (res) => {
        hideLoading(loading);
        if (res.statusCode === 200) {
          if (res.data.success) {
            const decryptedRes = decryptData(res, IS_AES);
            resolve(decryptedRes.data);
          } else {
            if (
              res.data.code === Http_Result.AUTH_INVALID ||
              res.data.code === Http_Result.AUTH_INVALID_2
            ) {
              return handleTokenInvalid(url, option);
            } else if (res.data.code === Http_Result.REFRESH_INVALID) {
              clearAll();
              router.go({ url: '/pages/telLogin/index' });
              return reject(res.data);
            } else {
              if (loading) {
                Taro.showToast({
                  icon: 'none',
                  title: res.data.msg || utils.intl('error')
                });
              }
              resolve(res.data);
            }
          }
        } else {
          if (loading) {
            Taro.showToast({
              icon: 'none',
              title: utils.intl('networkError')
            });
          }
          reject({
            success: false,
            code: Http_Result.FAIL,
            msg: utils.intl('networkError')
          });
        }
      },
      fail: () => {
        hideLoading(loading);
        Taro.showToast({
          icon: 'none',
          title: utils.intl('networkError')
        });
        reject({
          success: false,
          code: Http_Result.FAIL,
          msg: utils.intl('networkError')
        });
      }
    });
  });
};

/**
 * GET 请求
 * @param url 
 * @param option 
 * @returns 
 */
export const get = (url: string, option: Option = {}) => {
  option.method = 'GET';
  return request(url, option);
};

/**
 * POST 请求
 * @param url 
 * @param option 
 * @returns 
 */
export const post = (url: string, option: Option) => {
  return request(url, option);
};


