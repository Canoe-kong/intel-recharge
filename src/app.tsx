import { Component, PropsWithChildren } from 'react';
import './app.less';
import { ConfigProvider } from '@nutui/nutui-react-taro';
import zhCN from '@nutui/nutui-react-taro/dist/locales/zh-CN';
// import enUS from '@nutui/nutui-react-taro/dist/locales/en-US'
import { getCurrentInstance } from '@tarojs/taro'
import './assets/styles/global.less';
import i18n from 'taro-i18n';
import locales from './locales/index';
import { cache, cacheKey } from '@/cache';
import { Provider } from 'react-redux';
import { store } from './model/store';
import GlobalLoading from '@/components/GlobalLoading';
import '@nutui/nutui-react-taro/dist/style.css'
import map from './utils/map';

class App extends Component<PropsWithChildren> {

  current = getCurrentInstance();
  initLocale = () => {
    console.log(this.current.router)
    const language = this.current.router?.params?.language;
    const lang = language || cache.get(cacheKey.INTL) || process.env.TARO_APP_INTL;
    i18n.t = new i18n(lang, locales);
    console.log('语言', lang);
    cache.set(cacheKey.INTL, lang);
  };
  //在生命周期方法中初始化组件
  UNSAFE_componentWillMount() {
    this.initLocale();
    // map.TMapGL()
  }
  componentDidMount() {
  }

  componentDidShow() { }

  componentDidHide() { }

  /**v3.5及以上支持 React 渲染流程之外的 JS 错误都能被其监听到；当渲染错误没有被开发者设置的错误边界捕获时，渲染报错都可以被监听到。 */
  onError(error) {
    console.log('==================Error==================', error);
  }
  render() {
    const { children } = this.props;

    return <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <GlobalLoading />
        {children}
      </Provider>
    </ConfigProvider>;
  }
}
export default App;

