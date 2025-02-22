import Taro from '@tarojs/taro';

// 定义事件类型枚举，避免硬编码字符串
export enum EventKey {
  INIT_FINISH = 'initFinish',
  LOGIN = 'login',
  ORDER_CHANGE = 'orderChange',
  RECHARGE_SUCCESS = 'rechargeSuccess',
  AUTH_CHECK = 'authCheck',
  COUPON_CHANGE = 'couponChange',
  RED_CAT_INTEGRAL = 'redCatIntegral'
}

// 定义回调函数的类型
type EventCallback = (...args: any[]) => void;

// 定义事件管理器类
class TaroEvent {
  /**
   * 注册事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: EventKey, callback: EventCallback) {
    Taro.eventCenter.on(eventName, callback);
  }

  /**
   * 移除事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  off(eventName: EventKey, callback: EventCallback) {
    Taro.eventCenter.off(eventName, callback);
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 事件参数
   */
  emit(eventName: EventKey, ...args: any[]) {
    Taro.eventCenter.trigger(eventName, ...args);
  }

  /**
   * 一次性事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  once(eventName: EventKey, callback: EventCallback) {
    Taro.eventCenter.once(eventName, callback);
  }

  /**
   * 移除所有事件监听
   */
  offAll() {
    Taro.eventCenter.off();
  }
}

// 创建事件管理器实例并导出
const event = new TaroEvent();
export default event;