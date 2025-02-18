import { Component, PropsWithChildren } from 'react';
import './app.less';
import { ConfigProvider } from '@nutui/nutui-react-taro';
import zhCN from '@nutui/nutui-react-taro/dist/locales/zh-CN';
import './assets/styles/global.less';
import i18n from 'taro-i18n';
import locales from './locales/index';
import { cache, cacheKey } from '@/cache';
class App extends Component<PropsWithChildren> {
  initLocale = () => {
    //1.使用系统语言的初始化方法,第一个参数是:语言类型 第二个参数是:词语仓库
    // Taro.getSystemInfo().then(result => {
    //   console.log('result', result);
    //   i18n.t = new i18n(result.language, locales);
    // });
    //2.使用给定的语言初始化方法,第一个参数是:语言类型 第二个参数是:词语仓库
    i18n.t = new i18n('zh', locales);
    cache.set(cacheKey.INTL, 'zh');
  };
  //在生命周期方法中初始化组件
  componentWillMount() {
    this.initLocale();
  }
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  /**v3.5及以上支持 React 渲染流程之外的 JS 错误都能被其监听到；当渲染错误没有被开发者设置的错误边界捕获时，渲染报错都可以被监听到。 */
  onError(error) {
    console.log('==================Error==================', error);
  }
  render() {
    const { children } = this.props;
    return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
  }
}
export default App;

