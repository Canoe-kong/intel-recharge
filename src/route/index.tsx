import utils from '@/utils';
import Taro from '@tarojs/taro';
interface RouteOptions {
  url?: string;
  query?: Record<string, any>;
  success?: (params: any) => void;
}
class TaroRouter {
  go({ url = '', query, success = () => { } }: RouteOptions = {}) {
    return new Promise((resolve, reject) => {
      Taro.navigateTo({
        url: query ? `${url}?${utils.stringifyQuery(query)}` : url,
        success: res => {
          success(res);
          resolve(res);
        },
        fail: reject,
      });
    }).catch(() => utils.promisify(Taro.switchTab)({ url }));
  }

  redirect({ url = '', query }: RouteOptions = {}) {
    return utils.promisify(Taro.redirectTo)({
      url: query ? `${url}?${utils.stringifyQuery(query)}` : url,
    })
      .catch(() => utils.promisify(Taro.switchTab)({ url }));
  }

  goBack({ delta = 1 } = {}) {
    return utils.promisify(Taro.navigateBack)({ delta });
  }

  reLaunch({ url = '', query }: RouteOptions = {}) {
    return utils.promisify(Taro.reLaunch)({
      url: query ? `${url}?${utils.stringifyQuery(query)}` : url,
    });
  }

  switchTab({ url = '' } = {}) {
    return utils.promisify(Taro.switchTab)({ url });
  }
}

const router = new TaroRouter();
export default router;
