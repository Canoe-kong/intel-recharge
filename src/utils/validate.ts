
// 邮箱
 const REG_EMAIL = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
// 手机号正则
 const REG_MOBILE = /^1[3456789]\d{9}$/
//澳门手机号正则
 const REG_MOBILE_MO = /^6\d{7}$/
//香港手机号正则4-9开头的8位数号码
 const REG_MOBILE_HK = /^([4-9])\d{7}$/
// 身份证号码
 const REG_IDCARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
// 金额
 const REG_MONEY = /^\d+(\.\d{1,2})?$/
// 中文
 const REG_ZHONGWEN = /^[^\u4e00-\u9fa5]+$/
// 大写字母和数字
 const REG_DAXIESHUZI = /^[A-Z0-9]+$/

const valid = {
  isEmail(str: string) {
    return REG_EMAIL.test(str)
  },
  isMobile(str:string) {
    return REG_MOBILE.test(str)
  },
  isMacauMobile(str:string) {
    return REG_MOBILE_MO.test(str)
  },
  isHongKongMobile(str:string) {
    return REG_MOBILE_HK.test(str)
  },
  isIdcard(str:string) {
    return REG_IDCARD.test(str)
  },
  isMoney(str:string) {
    return REG_MONEY.test(str)
  },
  isChinese(str:string) {
    return REG_ZHONGWEN.test(str)
  },
  isNumAndChat(str:string) {
    return REG_DAXIESHUZI.test(str)
  }
}

export default valid