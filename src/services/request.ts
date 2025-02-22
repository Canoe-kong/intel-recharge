import utils from "@/utils";
import API from "./api";
import { cache,cacheKey } from "@/cache";
import Taro from "@tarojs/taro";
import { get, post } from "@/services/http";
export default {
  /**
   * 获取公司信息
   */
  async getConfig() {
    const url = utils.isH5() ? API.CONFIG_H5 : API.CONFIG;
    let result = await utils.trans(
      get(url, {
        pathParam: ['BASE_BUSINESS_INFO']
      })
    );
    if (!result.success || !result.data || !result.data.value) {
      return null;
    }
    cache.set(cacheKey.BASE_CONFIG, JSON.parse(result.data.value));
    return JSON.parse(result.data.value);
  },

  /**获取cdn路径 */
  async getAllBasePath() {
    if (!API.getAllBasePath || API.getAllBasePath == undefined) {
      console.log('come on undefined');
      return;
    }
    let result = await utils.trans(
      post(API.getAllBasePath, {
        loading: false
      })
    );
    cache.set(cacheKey.BASE_PATH, result.data);
    return result;
  },
  /**
   * 微信：返回accessToken, isTourist 是否为游客，0  不是，1是
   * 如果是游客accessToken=openId, 直接缓存到openId, 如果不是那就是真实的accessToken， 缓存到accessToken
   * 支付宝：accessToken 真实的用户accessToken， isTourist必定是0
   * @param {*} code 微信和支付宝code
   */
  async login(data) {
    let result = await utils.trans(
      post(API.LOGIN, {
        loading: true,
        param: {
          clientType: utils.isWechat() ? 'WECHAT_MP' : utils.isH5() ? 'MOBILE_H5' : 'ALIPAY_MP',
          ...data
        }
      })
    );
    if (result.success) {
      // dva.getDispatch()(createAction(reduxTypes.CHANGE_TOKEN, result.data.accessToken));
    } else {
      return false;
    }
    return { isTourist: result.data.isTourist };
  },


  async alipayInitUser(param) {
    let openId = cache.get(cacheKey.OPEN_ID);
    console.log('openid', openId);
    let result = await utils.trans(
      post(API.ALIPAY_MP_INIT_USER, {
        loading: true,
        param: {
          alipayUserId: openId,
          nick: param.nickName,
          avatarurl: param.avatar,
          country: param.countryCode,
          province: param.province,
          city: param.city,
          gender: param.gender === 'm' ? 1 : 2
        }
      })
    );
    if (result.success) {
      // dva.getDispatch()(createAction(reduxTypes.CHANGE_TOKEN, result.data.accessToken));
      return true;
    } else {
      return false;
    }
  },

  /**
   * 获取用户信息
   */
  async getUserInfo(loading = false) {
    const userInfoUrl = utils.isH5() ? API.USER_INFO_H5 : API.USER_INFO;
    let result = await utils.trans(get(userInfoUrl, { loading: loading }));
    if (result.success) {
      // 处理支付宝因为修改store中数据导致注册返回后，租借确认页面没有按钮
      if (utils.isAlipay()) {
        cache.set(cacheKey.USERINFO, result.data);
      } else {
        // dva.getDispatch()(createAction(reduxTypes.CHANGE_USER_INFO, result.data));
      }
      return result.data;
    }
    return false;
  },

  /**
   *
   * @param {*} encryptedData
   * @param {*} iv
   */
  async bindMobile(encryptedData, iv) {
    let result = await utils.trans(
      post(API.BIND_MOBILE, {
        loading: true,
        param: {
          encryptedData,
          iv
        }
      })
    );
    if (result.success) {
      // dva.getDispatch()(createAction(reduxTypes.CHANGE_TOKEN, result.data));
    }
    return result;
  },
  /**
   * 绑定手机号（用户手动输入）
   * @param {*} mobile
   */
  async bindMobileToInput(param) {
    let result = await utils.trans(
      post(API.BIND_MOBILE_TO_INPUT, {
        loading: true,
        param
      })
    );
    if (result.success) {
      // dva.getDispatch()(createAction(reduxTypes.CHANGE_TOKEN, result.data));
    }
    return result;
  },
  /**
   * 获取验证码
   * @param {*} mobile
   */
  async sendMobileCode(param) {
    if (utils.isH5()) {
      return await this.sendH5MobileCode(param);
    }
    let result = await utils.trans(
      post(API.SEND_MOBILE_CODE, {
        loading: true,
        param: {
          ...param
        }
      })
    );
    return result;
  },

  /**获取验证码 H5 */
  async sendH5MobileCode(params) {
    let result = await utils.trans(
      post(API.SEND_MOBILE_CODE_H5, {
        loading: true,
        param:
          params.areaCode === '86'
            ? {
              type: 'flash_power_login_confirmation',
              platformCode: 'base',
              ...params
            }
            : params.areaCode === '853'
              ? {
                type: 'mo_consumer_h5_login',
                platformCode: 'moBase',
                ...params
              }
              : {
                type: 'hk_consumer_h5_login',
                platformCode: 'moBase',
                ...params
              }
      })
    );
    return result;
  },

  /**
   * 押金充值
   * payChannel 微信小程序 11， 支付宝小程序 21 押金账户  51
   * 支付方式
   * payWay 微信支付 wx 聚合支付 utils
   */
  async depositRecharge(params) {
    const depositRechargeUrl = utils.isH5() ? API.DEPOSIT_RECHARGE_H5 : API.DEPOSIT_RECHARGE;
    const payChannel = () => {
      if (utils.isWechat()) return { payChannel: 11 };
      if (utils.isAlipay()) return { payChannel: 21 };
      if (utils.isH5()) {
        let { orderInfo } = cache.get(cacheKey.SCAN);
        return {
          payChannel: 51,
          accessToken: cache.get(cacheKey.ACCESS_TOKEN),
          deviceNo: cache.get(cacheKey.DEVICE_ID),
          orderNo: orderInfo && orderInfo.preOrderNo ? orderInfo.preOrderNo : '',
          ...params
        };
      }
    };
    let result = await utils.trans(
      post(depositRechargeUrl, {
        loading: true,
        param: {
          ...payChannel()
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return false;
  },
  /**
   * 获取用户押金情况
   * @param {}} loading
   */
  async getDepositInfo(loading) {
    const depositInfoUrl = utils.isH5() ? API.DEPOSIT_INFO_H5 : API.DEPOSIT_INFO;
    let result = await utils.trans(
      get(depositInfoUrl, {
        loading: loading,
        param: {
          accountType: 2 //1钱包账户；2押金账户；3积分账户；4赠送金额账户
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return null;
  },

  /**
   * 退还押金
   */
  async depositRefund() {
    const depositRefundUrl = utils.isH5() ? API.DEPOSIT_REFUND_H5 : API.DEPOSIT_REFUND;
    let result = await utils.trans(post(depositRefundUrl, { loading: true }));
    if (result.success) {
      return true;
    }
    return false;
  },
  /**
   * 获取未完成的订单（hasOrder 是否有未完成的单子，orderNo 编号， orderStatus 状态）
   * @param {*} loading
   * @param {*} orderNo //如果有orderNo就传orderNo
   */
  async getUnFinishOrder(loading, orderNo) {
    orderNo = '';
    const unFinishOrderUrl = utils.isH5() ? API.ORDER_UN_FINISHED_H5 : API.ORDER_UN_FINISHED;
    let result = await utils.trans(
      post(unFinishOrderUrl, {
        loading: loading,
        param: { orderNo: orderNo || '' }
      })
    );
    if (result.success) {
      if (!result.data.hasOrder) {
        return null;
      }
      return result.data;
    }
    return null;
  },

  /**
   * 获取订单列表
   * @param {*} pageNo 分页从1开始
   * @param {*} pageSize
   * @param {*} loading
   */
  async getOrderList(pageNo, pageSize, loading) {
    const orderListUrl = utils.isH5() ? API.ORDER_LIST_H5 : API.ORDER_LIST;
    let result = await utils.trans(
      post(orderListUrl, {
        loading: loading,
        param: {
          pageNo: pageNo,
          pageSize: pageSize
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return null;
  },

  /**
   * 获取订单详情
   * @param {*} orderNo
   * @param {*} loading
   */
  async getOrderDetail(orderNo, loading) {
    if (!orderNo) {
      return;
    }
    const orderDetailUrl = utils.isH5() ? API.ORDER_DETAIL_H5 : API.ORDER_DETAIL;
    let result = await utils.trans(
      get(orderDetailUrl, {
        loading: loading,
        param: {
          orderNo: orderNo
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return null;
  },

  async payOrder(orderNo) {
    const payOrderUrl = utils.isH5() ? API.PAY_ORDER_H5 : API.PAY_ORDER;
    const payType = () => {
      if (utils.isWechat()) return 11;
      if (utils.isAlipay()) return 21;
      if (utils.isH5()) return 51;
    };
    let result = await utils.trans(
      post(payOrderUrl, {
        loading: true,
        param: {
          orderNo: orderNo,
          payType: payType()
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return false;
  },

  /**扫码 */
  async scan(scanUrl, loading) {
    // 屏蔽立充网点会员扫码进入
    if (stopLcUrl(scanUrl)) {
      return;
    }
    const scanApiUrl = utils.isH5() ? API.SCAN_STATUS_H5 : API.SCAN_STATUS;
    let result = await utils.trans(
      post(scanApiUrl, {
        loading: loading,
        param: {
          scanUrl
        }
      })
    );
    return result;
  },
  /**H5支付后调用扫码信息 */
  async scanInfoH5(data, loading = false) {
    let result = await utils.trans(
      post(API.SCAN_INFO_H5, {
        loading: loading,
        param: {
          ...data
        }
      })
    );
    return result;
  },

  /**
   * 等待设备推出页面轮询
   */
  async rentPush(orderNo, loading) {
    if (!orderNo) {
      return;
    }
    const rentPushUrl = utils.isH5() ? API.RENT_PUSH_H5 : API.RENT_PUSH;
    let result = await utils.trans(
      get(rentPushUrl, {
        loading: loading,
        param: {
          orderNo
        }
      })
    );
    if (result.success) {
      return result.data;
    }
  },
  /**
   * 租借授权
   */
  async rentAuth(orderNo, deviceNo, empowerType, formId) {
    Taro.showLoading({
      title: utils.intl('dealing'),
      mask: true
    });
    const rentAuthUrl = utils.isH5() ? API.RENT_AUTH_H5 : API.RENT_AUTH;
    let result = await utils.trans(
      post(rentAuthUrl, {
        param: {
          deviceNo,
          orderNo,
          empowerType,
          formId: formId || ''
        }
      })
    );
    Taro.hideLoading();
    if (!result.success) {
      if (
        result.code != '201005' &&
        result.code != '200016' &&
        result.code != '200005' &&
        result.code != '200015' &&
        result.code != '200020' &&
        result.code != '200013' &&
        result.code != '200014' &&
        result.code != '200004'
      ) {
        setTimeout(() => {
          Taro.showToast({
            icon: 'none',
            title: result.msg || '商家瞌睡了'
          });
        }, 100);
      }
    }
    return result;
  },
  /**
   * 充电宝遗失
   */
  async rentLose(orderNo, loading) {
    const rentLoseUrl = utils.isH5() ? API.RENT_LOSE_H5 : API.RENT_LOSE;
    let result = await utils.trans(
      get(rentLoseUrl, {
        loading: loading,
        param: {
          orderNo
        }
      })
    );
    return result;
  },
  /**
   * 充电宝无法取出
   */
  async rentUntake(orderNo, loading) {
    let result = await utils.trans(
      get(API.RENT_UNTAKE, {
        loading: loading,
        param: {
          orderNo
        }
      })
    );
    return result;
  },

  async getShopDetail(id) {
    const url = utils.isH5() ? API.SHOP_DETAIL_H5 : API.SHOP_DETAIL;
    let shop = await utils.trans(
      post(`${url}`, {
        loading: true,
        param: { shopId: id, showDeviceInfo: true }
      })
    );
    if (shop.success && shop.data && shop.data.id) {
      shop = shop.data;
      return dealShop(shop);
    } else {
      return null;
    }
  },
  async getShopList(params) {
    let {
      page,
      search,
      longitude,
      latitude,
      myLongitude,
      myLatitude,
      pageSize = 30,
      loading = true,
      showDeviceInfo
    } = params;
    const dealLnLa = map.gcj02tobd09(longitude, latitude);
    longitude = dealLnLa[0];
    latitude = dealLnLa[1];
    if (!longitude || !latitude || !myLatitude || !myLongitude) {
      return;
    }
    const url = utils.isH5() ? API.SHOP_LIST_H5 : API.SHOP_LIST;
    let shops = await utils.trans(
      post(url, {
        loading: loading,
        param: {
          pageNo: page || 1,
          pageSize: pageSize || 10,
          shopLat: latitude ? latitude.toString() : '',
          shopLng: longitude ? longitude.toString() : '',
          myLat: myLatitude ? myLatitude.toString() : '',
          myLng: myLongitude ? myLongitude.toString() : '',
          shopName: search || '',
          showDeviceInfo
          // productType: 2,
        }
      })
    );
    if (shops.success && shops.data && shops.data.totalCount) {
      shops = shops.data.list;
      return shops.map((shop) => {
        return dealShop(shop);
      });
    } else {
      return [];
    }
  },

  /**微信验签 */
  async wxSign(url, loading) {
    let result = await utils.trans(
      post(API.WECHAT_JSSDK_SIGN, {
        loading: loading,
        param: {
          webUrl: url
        }
      })
    );
    return result;
  },
  /**错误页面的排队接口 */
  async queue(deviceId, loading) {
    const errorQueueUrl = utils.isH5() ? API.ERROR_QUEUE_H5 : API.ERROR_QUEUE;
    let result = await utils.trans(
      get(errorQueueUrl, {
        loading: loading,
        param: {
          deviceId
        }
      })
    );
    if (result.success) {
      return result.data;
    }
  },
  /**
   * 获取后台配置的押金金额
   */
  async depositAmount() {
    const depositAmountUrl = utils.isH5() ? API.DEPOSIT_AMOUNT_H5 : API.DEPOSIT_AMOUNT;
    let result = await utils.trans(get(depositAmountUrl));
    if (result.success) {
      return result.data;
    }
    //没有拿到就拿99MOP
    return { depositAmount: '99' };
  },

  /**
   * 授权中传递错误信息
   * @param {}} orderNo
   * @param {*} empowerResult success or fail
   * @param {*} resultDesc 原因
   */
  async empowerCheck(orderNo, empowerResult, resultDesc, loading) {
    await utils.trans(
      post(API.EMPOWER_CHECK, {
        loading: loading,
        param: {
          orderNo,
          empowerResult,
          resultDesc
        }
      })
    );
    return true;
  },

  /**
   * 微信支付分支付
   */
  async wxScorePay(orderNo) {
    let result = await utils.trans(
      get(API.WX_SCODE_PAY, {
        loading: true,
        param: {
          orderNo
        }
      })
    );
    if (result.success) {
      return result.data;
    }
    return null;
  },
  /**
   * 设置押金代扣
   * @param {*} needPay
   */
  async depositPaySet(needPay) {
    let result = await utils.trans(
      post(API.DEPOSIT_PAY, {
        loading: true,
        param: {
          needPay
        }
      })
    );
    return result.success;
  },

  /**
   *
   * @param {*} couponState  1 可用， 3不可
   */
  async getMyCoupons(couponState) {
    let result = await utils.trans(
      post(API.COUPON_MY, {
        loading: true,
        param: {
          couponState
        }
      })
    );
    if (result.data && result.data.list) {
      return result.data.list;
    }
    return null;
  },

  async getMyCouponsCount() {
    let result = await utils.trans(post(API.COUPON_My_COUNT));
    return result.data || 0;
  },

  async getCouponsForOrder(orderNo, shopId) {
    let result = await utils.trans(
      post(API.COUPON_FOR_ORDER, {
        loading: true,
        param: {
          orderNo,
          shopId: shopId || ''
        }
      })
    );
    if (result.data && result.data.list) {
      return result.data.list;
    }
    return null;
  },

  async modifyCouponForOrder(couponId, orderNo, shopId) {
    let result = await utils.trans(
      post(API.COUPON_MODIFY, {
        loading: true,
        param: {
          couponId,
          orderNo,
          shopId: shopId || ''
        }
      })
    );
    return result;
  },

  async advert(shopId, space, type) {
    let param = { advertSpace: space };
    if (shopId) {
      param.shopId = shopId;
    }
    if (type) {
      param.queryType = type;
    }
    let result = await utils.trans(
      post(API.ADVERT, {
        param
      })
    );
    if (result.success) {
      return result.data.list || [];
    }
    return result.success;
  },
  /**
   * 查询红猫多多积分
   */
  async queryActivityInfo(params) {
    let result = await utils.trans(
      post(API.QUERY_ACTIVITY_INFO, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result.data;
    }
    return null;
  },
  /**
   * 扫码激活会员二维码
   */
  async getActivityVipQRCode(params) {
    let result = await utils.trans(
      post(API.ACTIVITY_VIP_QRCODE_H5, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 获取用户会员权益信息
   */
  async getUserVipInfo(params) {
    let result = await utils.trans(
      post(API.VIP_USER_INFO_H5, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 隐私政策查询
   */
  async getPolicyStatus(params) {
    let result = await utils.trans(
      get(API.POLICY_STATUS, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 隐私政策签/解约
   */
  async changePolicyStatus(params) {
    let result = await utils.trans(
      get(API.CHANGE_POLICY_STATUS, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 注销账号
   */
  async getLogOff(params) {
    const logoffUrl = utils.isH5() ? API.LOG_OFF_H5 : API.LOG_OFF;
    let result = await utils.trans(
      get(logoffUrl, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      cache.remove(cacheKey.ACCESS_TOKEN);
      cache.remove(cacheKey.USERINFO);
      return result;
    }

    return result;
  },
  /**
   * 退出登录
   */
  async getLogoOut(params) {
    const logOutUrl = utils.isH5() ? API.LOGO_OUT_H5 : API.LOGO_OUT;
    let result = await utils.trans(
      get(logOutUrl, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      cache.remove(cacheKey.ACCESS_TOKEN);
      cache.remove(cacheKey.USERINFO);
      return result;
    }

    return result;
  },
  /**
   * 查询用户今日网点会员权益信息
   */
  async getUserVipStatusInfo(params) {
    const result = await utils.trans(
      post(API.USER_VIP_INFO_H5, {
        loading: false,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 查询故障/问题类型列表
   * 4,"客诉-故障上报"
   * 5,"客诉-订单疑问"
   * 6,"客诉-门店反馈"
   */
  async getQATypeList(params) {
    const url = utils.isH5() ? API.QA_TYPE_LIST_H5 : API.QA_TYPE_LIST;
    const result = await utils.trans(
      post(url, {
        loading: false,
        param: params
      })
    );
    return result;
  },
  /**
   * 文件上传
   */
  async getOssuploadfile(file, loading = true) {
    let result = await utils.trans(
      new Promise((resolve, reject) => {
        if (loading) {
          Taro.showLoading({ title: '图片上传中' });
        }
        Taro.uploadFile({
          url: API.OSS_UPLOADFILE,
          filePath: file.url,
          name: 'multipartFile',
          success(res) {
            if (loading) {
              Taro.hideLoading();
            }
            let path = JSON.parse(res.data).data;
            if (path) {
              resolve(path);
            } else {
              reject('');
              Taro.showToast({
                title: utils.intl('uploadFail'),
                icon: 'none'
              });
            }
          },
          fail() {
            reject('');
            if (loading) {
              Taro.hideLoading();
            }
            Taro.showToast({
              title: utils.intl('uploadFail'),
              icon: 'none'
            });
          }
        });
      })
    );
    return result;
  },
  /**
   * 文件上传
   */
  async getOssuploadH5file(file, loading = true) {
    // console.log('file', file, file.file.originalFileObj.name, loading);
    const timestamp = new Date().getTime(); // 获取当前时间戳（毫秒）
    const fileName = file.file.originalFileObj.name;
    const extension = fileName.split('.').pop(); // 获取文件扩展名
    const newFileName = `${fileName
      .split('.')
      .slice(0, -1)
      .join('.')}_${timestamp}_${Math.random()}.${extension}`; // 新文件名
    // console.log('newFileName', newFileName);
    let result = await utils.trans(
      new Promise((resolve, reject) => {
        if (loading) {
          Taro.showLoading({ title: utils.intl('uploading'), mask: true });
        }
        Taro.uploadFile({
          url: API.OSS_UPLOADFILE_H5,
          filePath: file.url,
          name: 'file',
          fileName: newFileName,
          header: {
            accessToken: cache.get(cacheKey.ACCESS_TOKEN)
          },
          formData: {
            moduleName: 'complaint',
            type: 'cdn',
            areaName: 'mo'
          },
          success(res) {
            // console.log('res', res);
            if (loading) {
              Taro.hideLoading();
            }
            let path = JSON.parse(res.data).data;
            if (path) {
              resolve(path);
            } else {
              reject('');
              Taro.showToast({
                title: utils.intl('uploadFail'),
                icon: 'none'
              });
            }
          },
          fail() {
            reject('');
            if (loading) {
              Taro.hideLoading();
            }
            Taro.showToast({
              title: utils.intl('uploadFail'),
              icon: 'none'
            });
          }
        });
      })
    );
    return result;
  },
  /**
   * 客诉提交
   */
  async getComplaintCommit(params) {
    const url = utils.isH5() ? API.COMPLAINT_COMMIT_H5 : API.COMPLAINT_COMMIT;
    const result = await utils.trans(
      post(url, {
        loading: true,
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   *  客诉列表
   */
  async getComplaintList(pageNo, pageSize, loading) {
    const url = utils.isH5() ? API.COMPLAINT_LIST_H5 : API.COMPLAINT_LIST;
    const result = await utils.trans(
      post(url, {
        loading: loading,
        param: { pageNum: pageNo, pageSize: pageSize }
      })
    );
    if (result.success) {
      return result.data;
    }
    return result;
  },
  /**
   * 客诉详情
   */
  async getComplaintDetail(params) {
    const url = utils.isH5() ? API.COMPLAINT_DETAIL_H5 : API.COMPLAINT_DETAIL;
    const result = await utils.trans(
      post(url, {
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * H5登录（注册）
   */
  async loginH5(params) {
    console.log('params', params);
    const result = await utils.trans(
      post(API.LOGIN_H5, {
        param:
          params.internationalCode == '86'
            ? {
              captchaType: 'flash_power_login_confirmation',
              platformCode: 'base',
              ...params
            }
            : params.internationalCode == '853'
              ? {
                captchaType: 'mo_consumer_h5_login',
                platformCode: 'moBase',
                ...params
              }
              : {
                captchaType: 'hk_consumer_h5_login',
                platformCode: 'moBase',
                ...params
              }
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * H5刷新token
   * 获取新的登录态
   */
  async refreshTokenH5(params) {
    const result = await utils.trans(
      post(API.REFRESH_TOKEN_H5, {
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  },
  /**
   * 广告详情
   */
  async getAdvertisementList(params) {
    const result = await utils.trans(
      post(API.ADVERTISEMENT_LIST, {
        param: params
      })
    );
    if (result.success) {
      return result;
    }
    return result;
  }
};