import Taro from '@tarojs/taro';
import { isAlipay } from './normal';
import { promisify } from './promisify';
// 定义一些常量
const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
export default {
  //打开地图
  openLocation(params) {
    const { latitude, longitude, shopName, address } = params;
    return promisify(Taro.openLocation)({
      latitude,
      longitude,
      name: shopName,
      address: address
    });
  },
  dealShopToMarker(shop, isClick) {
    let baseMarker = {
      width: '64rpx',
      height: '84rpx',
      zIndex: 3,
      iconPath: shop.deviceInfo.quickPowerNum
        ? '/assets/images/index/shop_quick.png'
        : '/assets/images/index/shop.png'
    };
    let clickMarker = {
      width: '84rpx',
      height: '108rpx',
      zIndex: 4,
      iconPath: shop.deviceInfo.quickPowerNum
        ? '/assets/images/index/shop_s_quick.png'
        : '/assets/images/index/shop_s.png'
    };
    if (isAlipay()) {
      //支付宝小程序参数
      baseMarker = {
        width: 32,
        height: 42,
        markerLevel: 3,
        iconPath: shop.deviceInfo.quickPowerNum
          ? '/assets/images/index/shop_quick.png'
          : '/assets/images/index/shop.png'
      };
      clickMarker = {
        width: 42,
        height: 54,
        markerLevel: 4,
        iconPath: shop.deviceInfo.quickPowerNum
          ? '/assets/images/index/shop_s_quick.png'
          : '/assets/images/index/shop_s.png'
      };
    }
    return Object.assign(
      shop,
      {
        iconPath: shop.deviceInfo.quickPowerNum
          ? '/assets/images/index/shop_quick.png'
          : '/assets/images/index/shop.png'
      },
      isClick ? clickMarker : baseMarker
    );
  },
  /**
   * 根据marker是否需要凸显对参数进行调整
   * @param shops 需要调整的shops
   * @param id 需要凸显的id
   * @returns {*}
   */
  dealShopsToMarkers(shops, id) {
    let currentShop = {};
    let markers = shops.map((shop) => {
      let isClick = false;
      if (id && id == shop.id) {
        currentShop = shop;
        isClick = true;
      }
      return this.dealShopToMarker(shop, isClick);
    });
    return { markers, currentShop };
  },
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
   * 即 百度 转 谷歌、高德、腾讯
   * @param bd_lng
   * @param bd_lat
   * @returns {*[]}
   */
  bd09togcj02(bd_lng, bd_lat) {
    bd_lng = Number(bd_lng);
    bd_lat = Number(bd_lat);
    let x = bd_lng - 0.0065;
    let y = bd_lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    let gg_lng = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  },

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即 谷歌、高德、腾讯 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  gcj02tobd09(lng, lat) {
    lng = Number(lng);
    lat = Number(lat);
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  }
};
