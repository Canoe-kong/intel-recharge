const path = require('path');
const H5_ENV = {
  test: 'fat',
  production: 'prod',
  pre: 'pre'
};
const mode = process.env.MODE || 'test';
const outputRootStrategy = {
  h5: `h5/${H5_ENV[mode]}`,
  weapp: 'weapp',
  alipay: 'alipay',
  swan: 'swan',
  ['undefined']: 'dist'
};
const env = process.env.npm_config_argv? JSON.parse(process.env.npm_config_argv)['cooked'][1].split(':')[1]: 'h5';
const outputRoot = outputRootStrategy[env];
const config = {
  projectName: 'intel-recharge',
  date: '2025-2-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: `dist/${outputRoot}`,
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  cache: {
    enable: true // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@pages': path.resolve(__dirname, '..', 'src/pages'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
    '@images': path.resolve(__dirname, '..', 'src/assets/images'),
    '@utils': path.resolve(__dirname, '..', 'src/utils')
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    // esnextModules: ['nutui-react'],
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-']
        }
      },
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    router: {
      mode: 'browser'
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
