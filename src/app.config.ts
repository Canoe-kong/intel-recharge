export default defineAppConfig({
  pages: ['pages/index/index', 'pages/telLogin/index'],
  subPackages: [{ root: 'subPackages/others', pages: ['webview/index'] }],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  animation: false
});
