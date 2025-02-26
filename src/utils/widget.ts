import Taro from '@tarojs/taro';
import utils from '.';
class Widget {
  toast(title: string, callback?: () => void, duration?: number) {
    Taro.showToast({
      icon: 'none',
      title: title,
      duration: duration || 2000,
      mask: true
    });
    if (callback) {
      setTimeout(() => {
        callback();
      }, duration || 2000);
    }
  }

  toastSuccess(title: string, callback?: () => void, duration?: number) {
    Taro.showToast({
      icon: 'success',
      title: title,
      duration: duration || 2000,
      mask: true
    });
    if (callback) {
      setTimeout(() => {
        callback();
      }, duration || 2000);
    }
  }

  alert(message: string, callback?: () => void, title?: string) {
    Taro.showModal({
      title: title || utils.intl('tip'),
      showCancel: false,
      content: message,
      confirmText: utils.intl('confirmText'),
      confirmColor: '#1677fe',
      success: () => {
        if (callback) {
          callback();
        }
      }
    });
  }

  confirm(
    message: string,
    callback?: () => void,
    title?: string,
    buttonName?: string[],
    cancel?: () => void
  ) {
    let trueTitle: string | undefined;
    let cancelText: string | undefined;

    if (buttonName) {
      if (buttonName.length === 1) {
        trueTitle = buttonName[0];
      } else if (buttonName.length === 2) {
        trueTitle = buttonName[0];
        cancelText = buttonName[1];
      }
    }

    Taro.showModal({
      title: title || '',
      content: message,
      confirmText: trueTitle || utils.intl('confirmText'),
      cancelText: cancelText || utils.intl('cancelText'),
      confirmColor: '#16953C',
      success: (res) => {
        if (res.confirm) {
          if (callback) {
            callback();
          }
        } else if (res.cancel) {
          if (cancel) {
            cancel();
          }
        }
      }
    });
  }
}
const widget = new Widget();
export default widget;
