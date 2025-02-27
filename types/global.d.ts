/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace WeixinJS {
  interface ConfigOptions {
    debug?: boolean;
    appId: string;
    timestamp: number;
    nonceStr: string;
    signature: string;
    jsApiList: string[];
  }
  function config(options: ConfigOptions): void;
}
declare const wx: WeixinJS;
declare const TMap: {
  MarkerStyle: any;
  MultiMarker: any;
  LatLng: new (lat: number, lng: number) => any;
  Map: new (container: string | HTMLElement, options: any) => any;
};
declare interface Window {
  TMap: typeof TMap;
}

declare const qq: any;

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
  }
}
