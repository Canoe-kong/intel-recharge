import { View, Text } from "@tarojs/components"
import styles from './index.module.less'
import utils from "@/utils"
import CommonButton from "@/components/CommonButton";
import classNames from 'classnames';
import { Scan } from '@nutui/icons-react-taro'
import router from "@/route";
const Tab = (props: { isShowOrder: boolean }) => {
  const { isShowOrder } = props
  const nearbyShopHandler = () => {
    router.go({ url: '' })
  }
  const centerHandler = () => { }
  const scanToRentHandler = () => { }
  return (
    <View className={styles.tabBox}>
      <View
        className={styles.btn}
        onClick={nearbyShopHandler}>
        <img className={styles.icon} src={require('@/assets/images/index/shops.png')} />
        <span className={styles.btnText}>{utils.intl('neighbouringShop')}</span>
      </View>
      <CommonButton
        onClick={scanToRentHandler}
        className={styles.scanBtn}
        disabled={isShowOrder}
        name={utils.intl('scanToPower')}
        icon={<Scan width={14} height={14} style={{ marginRight: '4px' }} />}>

      </CommonButton>

      <View
        className={styles.btn}
        onClick={centerHandler}>
        <img className={styles.icon} src={require('@/assets/images/index/mine.png')} />
        <span className={classNames(styles.btnText, styles.black)}>{utils.intl('personalCenter')}</span>
      </View>
    </View>
  )
}

export default Tab