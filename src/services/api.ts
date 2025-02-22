const SERVE_URL = process.env.TARO_APP_SERVE_URL;
 const API = {
  //获取配置根据key获取配置，json格式
  CONFIG: SERVE_URL + '/taichi/common/config/{?}',
  //登录
  LOGIN: SERVE_URL + '/plato/user/v1/auth/login',
  //微信用户解密==后台初始化用户信息
  WECHAT_MP_DECODE: SERVE_URL + '/plato/user/v1/auth/wechat/mp/decode',
  //支付宝==后台初始化用户信息
  ALIPAY_MP_INIT_USER: SERVE_URL + '/plato/user/v1/auth/alipay/mp/initUser',
  //获取用户信息
  USER_INFO: SERVE_URL + '/plato/user/v1/info/userinfo',
  //绑定手机号
  BIND_MOBILE: SERVE_URL + '/plato/user/v1/info/mobile/direct/bind',
  //绑定手机号(手动输入)
  BIND_MOBILE_TO_INPUT: SERVE_URL + '/plato/user/v1/mobile/bind',
  //获取验证码
  SEND_MOBILE_CODE: SERVE_URL + '/plato/user/v1/register/send',
  //用户押金情况
  DEPOSIT_INFO: SERVE_URL + '/plato/user/v1/account/deposit/info',
  //押金充值
  DEPOSIT_RECHARGE: SERVE_URL + '/plato/user/v1/account/deposit/recharge',
  //退押金
  DEPOSIT_REFUND: SERVE_URL + '/plato/user/v1/account/deposit/refund',
  //轮询未完成的订单
  ORDER_UN_FINISHED: SERVE_URL + '/tjd/order/v1/rent/info',
  // 首页扫码
  SCAN_STATUS: SERVE_URL + '/tjd/device/v1/scan',
  //微信jssdk验签
  WECHAT_JSSDK_SIGN: SERVE_URL + '/gateway/power-basic/wx/getSignature',
  // 错误-排队
  ERROR_QUEUE: SERVE_URL + '/tjd/device/v1/waitLock',
  //订单列表
  ORDER_LIST: SERVE_URL + '/tjd/order/v1/rent/lists',
  //订单详情
  ORDER_DETAIL: SERVE_URL + '/tjd/order/v1/detail',
  // 等待设备推出页面
  RENT_PUSH: SERVE_URL + '/tjd/order/v1/deliver/wait',
  // 租借授权接口
  RENT_AUTH: SERVE_URL + '/tjd/empower/v1/auth',
  //支付接口
  PAY_ORDER: SERVE_URL + '/tjd/pay/v1/order',
  // 充电宝遗失
  RENT_LOSE: SERVE_URL + '/tjd/order/v1/rent/lose',
  // 充电宝无法取出
  RENT_UNTAKE: SERVE_URL + '/tjd/order/v1/rent/untake',
  //店铺列表
  SHOP_LIST: SERVE_URL + '/lincoln/shop/v1/list/location',
  //店铺详情
  SHOP_DETAIL: SERVE_URL + '/lincoln/shop/v1/info/simpleInfo', //{shopId}
  //检验授权接口，传前端的成功和失败
  EMPOWER_CHECK: SERVE_URL + '/tjd/empower/v1/check',
  //获取押金配置金额
  DEPOSIT_AMOUNT: SERVE_URL + '/tjd/empower/v1/deposit/amount',
  //微信支付分查询
  WX_SCODE_PAY: SERVE_URL + '/tjd/empower/v1/link/query',
  //设置是否押金代扣
  DEPOSIT_PAY: SERVE_URL + '/plato/user/v1/account/deposit/save/status',
  //选择优惠券页面列表
  COUPON_FOR_ORDER: SERVE_URL + `/tjd/coupon/v1/order/enable`,
  //我的优惠券
  COUPON_MY: SERVE_URL + `/tjd/coupon/v1/mycoupons`,
  //修改订单优惠券
  COUPON_MODIFY: SERVE_URL + `/tjd/coupon/v1/order/modify`,

  //广告
  ADVERT: SERVE_URL + `/tjd/advert/v1/fetch`,
  // 查询积分发放记录
  QUERY_ACTIVITY_INFO: SERVE_URL + `/market/send/msg/v1/queryByMobile`,
  // 隐私政策查询
  POLICY_STATUS: SERVE_URL + `/plato/user/v1/info/policy/query`,
  // 隐私政策签/解约
  CHANGE_POLICY_STATUS: SERVE_URL + `/plato/user/v1/privacy/policy/enable`,
  // 注销账号
  LOG_OFF: SERVE_URL + `/plato/user/v1/info/deleted`,
  // 退出登录
  LOGO_OUT: SERVE_URL + `/plato/user/v1/info/logoff`,
  // 故障/问题类型获取字典枚举
  QA_TYPE_LIST: SERVE_URL + `/dict/v1/list`,
  // 文件上传功能
  OSS_UPLOADFILE: SERVE_URL + `/oss/uploadFile2`,
  // 客诉提交
  COMPLAINT_COMMIT: SERVE_URL + `/customer/complaint/commit`,
  // 客诉列表
  COMPLAINT_LIST: SERVE_URL + `/customer/complaint/list`,
  // 客诉详情
  COMPLAINT_DETAIL: SERVE_URL + `/customer/complaint/detail`,
  // 查询用户今日网点会员权益信息
  USER_VIP_INFO_H5: SERVE_URL + '/gateway/power-consumer/plato/user/v1/vip/getUserShopVipInfo',
  // 查询用户会员信息
  VIP_USER_INFO_H5: SERVE_URL + `/gateway/power-consumer/plato/user/v1/vip/info`,
  // 扫码激活会员二维码
  ACTIVITY_VIP_QRCODE_H5: SERVE_URL + `/gateway/power-consumer/plato/user/v1/vip/scan`,
  // H5手机验证码登录
  LOGIN_H5: SERVE_URL + '/gateway/power-consumer/oauth/captcha/token',
  // H5刷新新的token
  REFRESH_TOKEN_H5: SERVE_URL + '/gateway/power-consumer/oauth/refresh/token',
  // H5注销账号
  LOG_OFF_H5: SERVE_URL + '/gateway/power-consumer/oauth/deleted',
  // H5退出登录
  LOGO_OUT_H5: SERVE_URL + '/gateway/power-consumer/oauth/remove/token',
  // H5获取用户信息
  USER_INFO_H5: SERVE_URL + '/gateway/power-consumer/plato/user/v1/user/getUserInfoById',
  // H5获取业务押金额度
  DEPOSIT_AMOUNT_H5: SERVE_URL + '/gateway/power-consumer/tjd/empower/v1/deposit/amount',
  //H5用户押金情况
  DEPOSIT_INFO_H5: SERVE_URL + '/gateway/power-consumer/plato/user/v1/account/deposit/info',
  // H5错误-排队
  ERROR_QUEUE_H5: SERVE_URL + '/gateway/power-consumer/tjd/device/v1/waitLock',
  // H5租借授权接口
  RENT_AUTH_H5: SERVE_URL + '/gateway/power-consumer/tjd/empower/v1/auth',
  //H5押金充值
  DEPOSIT_RECHARGE_H5: SERVE_URL + '/gateway/power-consumer/plato/user/v1/account/deposit/recharge',
  //H5退押金
  DEPOSIT_REFUND_H5: SERVE_URL + '/gateway/power-consumer/plato/user/v1/account/deposit/refund',
  //H5轮询未完成的订单
  ORDER_UN_FINISHED_H5: SERVE_URL + '/gateway/power-consumer/tjd/order/v1/rent/info',
  //H5订单列表
  ORDER_LIST_H5: SERVE_URL + '/gateway/power-consumer/tjd/order/v1/rent/lists',
  // H5首页扫码
  SCAN_STATUS_H5: SERVE_URL + '/gateway/power-consumer/tjd/device/v1/scan',
  //H5获取验证码
  SEND_MOBILE_CODE_H5: SERVE_URL + '/gateway/power-basic/sms/commonCaptcha',
  // 客诉提交
  COMPLAINT_COMMIT_H5: SERVE_URL + `/gateway/power-consumer/customer/complaint/commit`,
  // 客诉列表
  COMPLAINT_LIST_H5: SERVE_URL + `/gateway/power-consumer/customer/complaint/list`,
  // 客诉详情
  COMPLAINT_DETAIL_H5: SERVE_URL + `/gateway/power-consumer/customer/complaint/detail`,
  // 故障/问题类型获取字典枚举
  QA_TYPE_LIST_H5: SERVE_URL + `/gateway/power-basic/dict/v1/list`,
  // 文件上传功能
  OSS_UPLOADFILE_H5: SERVE_URL + `/gateway/power-basic/file/uploadFileDefinedName`,
  //我的优惠券
  COUPON_My_COUNT: SERVE_URL + `/tjd/coupon/v1/mycoupon/count`,
  // H5等待设备推出页面
  RENT_PUSH_H5: SERVE_URL + '/gateway/power-consumer/tjd/order/v1/deliver/wait',
  // H5订单详情
  ORDER_DETAIL_H5: SERVE_URL + '/gateway/power-consumer/tjd/order/v1/detail',
  // H5充电宝遗失
  RENT_LOSE_H5: SERVE_URL + '/gateway/power-consumer/tjd/order/v1/rent/lose',
  //H5支付接口
  PAY_ORDER_H5: SERVE_URL + '/gateway/power-consumer/tjd/pay/v1/order',
  //H5店铺列表
  SHOP_LIST_H5: SERVE_URL + '/gateway/power-consumer/lincoln/shop/v1/list/location',
  //H5店铺详情
  SHOP_DETAIL_H5: SERVE_URL + '/gateway/power-consumer/lincoln/shop/v1/info/simpleInfo',
  //获取配置根据key获取配置，json格式
  CONFIG_H5: SERVE_URL + '/gateway/power-basic/common/config/{?}',
  //获取文件根路径-返回所有根路径
  getAllBasePath: SERVE_URL + `/gateway/power-basic/file/getAllBasePath`,
  // H5扫码成功后重新请求扫码信息
  SCAN_INFO_H5: SERVE_URL + `/gateway/power-consumer/tjd/device/v1/scanInfo`,
  // 广告列表
  ADVERTISEMENT_LIST: SERVE_URL + `/gateway/power-consumer/tjd/device/v1/advert/list`
};

export default API