import i18n from 'taro-i18n';
/**
 * 将对象转为query
 * @param {Object} query
 */
export const stringifyQuery = query => {
  try {
    return Object.keys(query)
      .filter(key => query[key] !== undefined && query[key] !== null)
      .map(key => `${key}=${query[key]}`)
      .join('&');
  } catch (err) {
    return '';
  }
};

/**
 * 多语言转化
 */
export const intl = (key: string, value?: any) => {
  return i18n.t._(key, value);
};
