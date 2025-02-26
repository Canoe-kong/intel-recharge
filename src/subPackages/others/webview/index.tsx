import { LC_H5_MO, WEBVIEW_KEY } from '@/utils/constant';
import { WebView } from '@tarojs/components';
import utils from '@/utils';
import { getCurrentInstance } from '@tarojs/taro'
const WebViewIndex = () => {
  const { router } = getCurrentInstance()
  // console.log('router', router)
  const type = router?.params?.type
  /**隐私文件列表 */
  const WEBVIEW_LIST = {
    [WEBVIEW_KEY.SERVICE]: {
      title: '服务协议',
      url: `${LC_H5_MO}${utils.currentLanguage()}/service.html`
    },
    [WEBVIEW_KEY.PRIVACY]: {
      title: '隐私协议',
      url: `${LC_H5_MO}${utils.currentLanguage()}/privacy.html`
    }
  }
  return <WebView src={type ? WEBVIEW_LIST[type].url : ''}></WebView>
}
export default WebViewIndex