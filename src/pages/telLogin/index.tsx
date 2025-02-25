import { useEffect, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.less';
import classNames from 'classnames';
import utils from '@/utils';
import ChangeLanguage from '@/components/ChangeLanguage';
import AreaCodePicker from '@/components/AreaCodePicker';
import createErrorBoundary from '@/pages/layouts';
import { forwardRef } from 'react';
import { Input } from '@nutui/nutui-react-taro'
import CommonButton from '@/components/CommonButton';
import services from '@/services';
import valid from '@/utils/validate';
import widget from '@/utils/widget';
import { cache, cacheKey } from '@/cache';
const COUNT_DOWN_TIME = 60;

const TelLogin = forwardRef(() => {
  const [changeLangVisible, setChangeLangVisible] = useState(false)
  const [changeAreaCodeVisible, setChangeAreaCodeVisible] = useState(false)
  const [internationalCode, setInternationalCode] = useState('853')
  const [mobile, setMobile] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [countdownTime, setCountdownTime] = useState(COUNT_DOWN_TIME)
  const [selected, setSelected] = useState(false)
  const [codeCountDownStatus, setCodeCountDownStatus] = useState(false)
  const [lock, setLock] = useState(false)


  /** 打开弹窗*/
  const openLangPopup = () => {
    setChangeLangVisible(true)
  }
  /** 打开选择区号弹窗 */
  const openAreaCodePopup = () => {
    setChangeAreaCodeVisible(true)
  }

  /** 关闭弹窗 */
  const closeLangPopup = () => {
    setChangeLangVisible(false)
  }
  /** 关闭选择区号弹窗 */
  const closeChangeAreaCode = () => {
    setChangeAreaCodeVisible(false)
  }
  /**确认回调 */
  const changeLanguage = () => {
    closeLangPopup()
  }

  /**确认选择区号 */
  const changeAreaCode = (value) => {
    setInternationalCode(value)
    closeChangeAreaCode()
  }

  /**修改手机号 */
  const changeMobile = (value) => {
    setMobile(value)
  }

  /**验证码 */
  const handleChangeCode = (value) => {
    setSmsCode(value)
  }

  /**获取验证码 */
  const handleDownCount = () => {
    const regTest =
      internationalCode === '853' /*澳门区号*/
        ? utils.isMacauMobile(mobile)
        : internationalCode === '852' /**香港区号 */
          ? utils.isHongKongMobile(mobile)
          : utils.isMobile(mobile);
    if (!regTest) {
      widget.toast(utils.intl('mobileRight'));
      return;
    }
    getCode();
  }

  // 获取验证
  const getCode = async () => {
    if (lock) {
      // widget.toast(utils.intl('debounceTip'));
      return;
    }
    setLock(true)
    const params = { mobile, areaCode: internationalCode };
    const res = await services.sendMobileCode(params);
    setLock(false)
    if (res.code === '000') {
      widget.toast(utils.intl('codeSend'));
      setCodeCountDownStatus(true)
    }
  }

  /**倒计时逻辑 */
  useEffect(() => {
    if (!codeCountDownStatus) return
    if (countdownTime === 0) {
      setCodeCountDownStatus(false)
      setCountdownTime(COUNT_DOWN_TIME)
      return
    }
    const timer = setTimeout(() => {
      setCountdownTime(countdownTime - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdownTime, codeCountDownStatus])

  /**提交表单 */
  const submit = async () => {
    const regTest =
      internationalCode === '853' /*澳门区号*/
        ? valid.isMacauMobile(mobile)
        : internationalCode === '852' /**香港区号 */
          ? valid.isHongKongMobile(mobile)
          : valid.isMobile(mobile);
    if (!regTest) {
      widget.toast(utils.intl('mobileRight'));
      return;
    }
    if (!smsCode) {
      widget.toast(utils.intl('codePlaceHolder'));
      return;
    }
    if (!selected) {
      widget.toast(utils.intl('selectTip'));
      return;
    }

    const res = await services.loginH5({
      appKey: utils.APP_KEY,
      appSecret: utils.APP_SECRET,
      mobile: mobile,
      captcha: smsCode,
      internationalCode
    });
    if (res.code === '000') {
      cache.set(cacheKey.ACCESS_TOKEN, res.data.accessToken);
      cache.set(cacheKey.REFRESH_TOKEN, res.data.accessToken);
      // 登录成功后刷新用户手机号
      await services.getUserInfo();
      services.getToken();
      utils.handleLoginSuccess()
    }
  }
  /**选择协议 */
  const selectHandle = () => {
    setSelected(!selected)
  }

  const goExplain = () => {

  }
  return (
    <View className={classNames(styles.telLoginContainer)}>
      <View className={styles.titleWrapper}>
        <View className={styles.titleName}>{utils.intl('welcome')}</View>
        <View className={styles.changeLangBox} onClick={openLangPopup}>
          <View className={styles.changeText}>
            {utils.intl('changeTo')}
          </View>
          <View className={styles.changeBtn}>
            <ChangeLanguage visible={changeLangVisible} changeSuccessCallBack={changeLanguage} onClose={closeLangPopup} />
          </View>
        </View>
      </View>
      <View className={styles.lineBox}>
        <View className={styles.telAreaCode} onClick={openAreaCodePopup}>
          <AreaCodePicker visible={changeAreaCodeVisible} changeSuccessCallBack={changeAreaCode} onClose={closeChangeAreaCode} />
        </View>
        <View className={styles.codeSpilt}></View>
        <Input
          className={styles.inputBox}
          name="mobile"
          type="tel"
          maxLength={11}
          placeholder={utils.intl('mobilePlaceHolder')}
          value={mobile}
          onChange={changeMobile}
          clearable
          placeholderStyle="color: #BFBFBF;"
        />
      </View>

      <View className={styles.lineBox}>
        <Input
          className={styles.inputBox}
          name="smsCode"
          placeholder={utils.intl('codePlaceHolder')}
          type="tel"
          value={smsCode}
          onChange={handleChangeCode}
          clearable
        />
        <View className={styles.codeSpilt}></View>
        {codeCountDownStatus ? (
          <View className={styles.codeText}> {utils.intl('sendTime', countdownTime)}</View>
        ) : (
          <View className={styles.codeText} onClick={handleDownCount}>
            {utils.intl('getCode')}
          </View>
        )}
      </View>
      <CommonButton
        className={styles.loginBtn}
        name={utils.intl('login')}
        onClick={submit}></CommonButton>

      <View className={styles.privacyWrapper} onClick={selectHandle}>
        <View className={styles.radio}>
          {selected ? (
            <img src={require('@/assets/images/login/select-icon.png')} className={styles.radioSelect} />
          ) : (
            <img src={require('@/assets/images/login/unselect-icon.png')} className={styles.radioUnselect} />
          )}
        </View>
        <View className={styles.agreementTip}>
          <span>{utils.intl('loginTip')}</span>
          <span
            className={styles.privacy}
            onClick={() => {
              goExplain(1);
            }}>
            《{utils.intl('userAggrement')}》
          </span>
          {utils.intl('and')}
          <span
            className={styles.privacy}
            onClick={() => {
              goExplain(3);
            }}>
            《{utils.intl('privacyPolicy')}》
          </span>
        </View>
      </View>

    </View >
  );
})

export default createErrorBoundary(TelLogin);
