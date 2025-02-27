import * as toolApi from './normal';
import * as promisify from './promisify';
import * as logic from './logic';
// import * as map from './map'
import valid from './validate';
import * as constant from './constant';

const utils = {
  ...toolApi,
  ...promisify,
  ...logic,
  // ...map,
  ...valid,
  ...constant
};

export default utils;
