import { Component } from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.less';
import classNames from 'classnames';
import utils from '@/utils';
class Index extends Component {
  render() {
    return (
      <View className={classNames('padding-top80 paddingX40', styles.telLogin)}>
        <View className="flex-spacebetween flex-algin padding-bottom72">
          <View className="titleName"></View>
          {
            <View className="changeLangBox flex-align-spacebetween">
              <View className="changeText color-theme margin-right10">
                {utils.intl('changeTo')}
              </View>
              <View className="flex-align changeBtn">
                {/* <ChangeLanguage changeSuccessCallBack={this.changeSuccessCallBack.bind(this)} /> */}
                {/* <AtIcon value="chevron-down" size="20"></AtIcon> */}
              </View>
            </View>
          }
        </View>
        <View className="lineBox lineTopNone">
          {
            <View className="telAreaCode">
              {/* <TelPicker
                changeSuccessCallBack={e => {
                  this.setState({
                    internationalCode: e
                  });
                }}
              /> */}
              {/* <img src={DownIcon} className="downIcon" /> */}
              {/* <AtIcon value="chevron-down" size="14"></AtIcon> */}
            </View>
          }
          {/* <AtInput
            className="inputBox"
            name="mobile"
            type="tel"
            maxlength="11"
            placeholder={this.$common.intl('mobilePlaceHolder')}
            value={mobile}
            onChange={this.onBlurTel.bind(this)}
            clear
          /> */}
        </View>

        <View className="lineBox lineTopNone">
          {/* <AtInput
            className="inputBox"
            name="smsCode"
            placeholder={this.$common.intl('codePlaceHolder')}
            type="tel"
            value={smsCode}
            onChange={this.handleChangeCode.bind(this)}
            clear
          /> */}
          <View className="codeSpilt"></View>
          {/* {timeCount <= 0 ? (
            <View className="codeText" onClick={this.handleDownCount.bind(this)}>
              {this.$common.intl('getCode')}
            </View>
          ) : (
            <View className="codeText"> {this.$common.intl('sendTime', timeCount)}</View>
          )} */}
        </View>
        {/* <CommonButton
          className="loginBtn common-button-size margin-top30"
          name={this.$common.intl('login')}
          onClick={this.submit.bind(this)}></CommonButton> */}
        {/* { (
          <View className="bottomServiceBox" onClick={this.selectHandle.bind(this)}>
            <View className="radio">
              {selected ? (
                <img src={SelectIcon} className="radio-select" />
              ) : (
                <img src={UnSelectIcon} className="radio-select" />
              )}
            </View>
            <View className="agreementTip">
              <span> {this.$common.intl('loginTip')}</span>
              <span
                className="color-theme"
                onClick={() => {
                  this.goExplain(1);
                }}>
                《{this.$common.intl('userAggrement')}》
              </span>
              {this.$common.intl('and')}
              <span
                className="color-theme"
                onClick={() => {
                  this.goExplain(3);
                }}>
                《{this.$common.intl('privacyPolicy')}》
              </span>
            </View>
          </View>
        )} */}
      </View>
    );
  }
}

export default Index;
