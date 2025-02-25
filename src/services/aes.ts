import CryptoJS from 'crypto-js'
import Jsrsasign, { KJUR, KEYUTIL } from 'jsrsasign'
import { cache,cacheKey } from '@/cache'

export const VERSION = '1.13.14';
export const AES_IV = '0112030445060709'
const RSA_KEY_FAT =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC54VbAJ2jvYWzEOVgFDnG0+HJFzANcezevxoWUxhalQG0KGpkKcHy13hl120cTIaLj2Pujb4zzuUbiQcSJnpZHvbWPvYlUVQeNzVflYmxRkTU/Bg0QbQXBP6yue9pFHkSLlNNjD1gR/TZcX5t9V/b47j13IGGwMiPGalQEoHdFkwIDAQAB\n-----END PUBLIC KEY-----'
const RSA_KEY_PRE =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCx4yKv/2O2M4A3V0+clfPf8RXv3Pl1mteWe+Tz8spB64GL3OUEE3WOltyE48uRnxujTthrV8tMKHb4pXjLuUFS5HjuFo4j3PNP16YO1lW1bL9V42oz2zBzHOOulR/h9F34RqkvslI9RoCRvTaWshyahD2g1v1Uu2+x/MCpcgB4gQIDAQAB\n-----END PUBLIC KEY-----'
const RSA_KEY_PRO =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMm2qWG6a4DxE17ubo3ZDDWXZySXOlxvETDWxhhuKn6QLeS6OmzbXQOevlF1ospPzbWbc4FoMkkNfNrMK1/tIi48rHMlhFoshHbISd6X7Vlwmq82qICXtbGMw1k+kLeYm5xqeu7gXPGHjGNOJ7EnBEkLr+aU7P5VN2tMXdnUZLkwIDAQAB\n-----END PUBLIC KEY-----'
const RSA_KEY_LIST = {
    dev: RSA_KEY_FAT,
    fat: RSA_KEY_FAT,
    pre: RSA_KEY_PRE,
    pro: RSA_KEY_PRO
}

export const handleRsaKey = () => {
  const env = process.env.TARO_APP_MODE === 'production' ? 'pro' : cache.get(cacheKey.CUR_ENV)
  return RSA_KEY_LIST[env]
}

// 生成AES密钥
export const getmm = (num = 16) => {
  var amm = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '_', 1, 2, 3, 4, 5, 6, 7, 8, 9]
  var tmp = Math.floor(Math.random() * num)
  var s = tmp
  s = s + amm[tmp]
  for (let i = 0; i < Math.floor(num / 2) - 1; i++) {
      tmp = Math.floor(Math.random() * 26)
      s = s + String.fromCharCode(65 + tmp)
  }
  for (let i = 0; i < num - Math.floor(num / 2) - 1; i++) {
      tmp = Math.floor(Math.random() * 26)
      s = s + String.fromCharCode(97 + tmp)
  }
  return s
}
export const encodeUtf8 = (value) => {
  return CryptoJS.enc.Utf8.parse(value)
}
/**
* AES加密
* @param {*} data 加密内容
* @param {*} key AES密钥
* @param {*} iv 偏移量
* @returns 加密后内容
*/
export const encrypt = (data, key, iv) => {
  const _data = encodeUtf8(data)
  const _key = encodeUtf8(key)
  const _iv = encodeUtf8(iv)
  return CryptoJS.AES.encrypt(_data, _key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: _iv
  }).toString()
}

/**
* AES揭秘
* @param {*} data 加密内容
* @param {*} key AES密钥
* @param {*} iv 偏移量
* @returns 解密后内容
*/
export const decrypt = (data, key, iv) => {
  const _key = encodeUtf8(key)
  const _iv = encodeUtf8(iv)
  return CryptoJS.AES.decrypt(data, _key, {
      mode: CryptoJS.mode.CBC,
      paddding: CryptoJS.pad.Pkcs7,
      iv: _iv
  }).toString(CryptoJS.enc.Utf8)
}
function isJsonString(str) {
  try {
      JSON.parse(str) // 尝试将字符串转换成JSON对象
      return true // 若能正常转换则返回true
  } catch (e) {
      return false // 若无法转换或发生错误则返回false
  }
}
const secretKey = getmm()
export const encryptRequestConfig = (option, header, data, IS_AES) => {
  if (!IS_AES) {
      return {
          option,
          header,
          data
      }
  }
  // 将参数转换为查询字符串格式
  if (option.method === 'GET') {
      data = Object.keys(data)
          .map((key) => key + '=' + encodeURIComponent(data[key]))
          .join('&')
  }
  const rsaKey = KEYUTIL.getKey(handleRsaKey())
  const encryptedRsaKey = KJUR.crypto.Cipher.encrypt(secretKey, rsaKey)
  const encryptAesKey = Jsrsasign.hextob64(encryptedRsaKey)
  const nonce = getmm()
  const timestamp = new Date().getTime()
  const sha = CryptoJS.SHA256(option.method === 'GET' ? data : JSON.stringify(data)).toString()
  header['PC'] = 'h5'
  header['PV'] = VERSION
  header['PA'] = encryptAesKey
  header['PS'] = sha
  header['PN'] = nonce
  header['PT'] = timestamp
  header['PB'] = timestamp
  data = option.method === 'GET' ? data : JSON.stringify(data)
  console.log('加密前请求参数：', data)
  if (data) {
      let temp = encrypt(data, secretKey, AES_IV)
      data = { content: temp }
  }
  return {
      option,
      header,
      data
  }
}
export const decryptData = (res, IS_AES) => {
  if (!IS_AES) {
      return res
  }
  // 处理没有content内容情况
  if (res.data.content) {
      const _data = decrypt(res.data.content, secretKey, AES_IV)
      res.data.data = isJsonString(_data) ? JSON.parse(_data) : _data
  }
  console.log('接口返回内容', res)
  return res
}
