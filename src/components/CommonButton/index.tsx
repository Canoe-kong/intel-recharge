import { useState } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { CommonButtonProps } from './type'
import styles from './index.module.less'
import classNames from 'classnames'
/**参考文档： https://nutui.jd.com/taro/react/2x/#/zh-CN/component/button */

const CommonButton = (props: CommonButtonProps) => {
  const [loading, setLoading] = useState(false)
  const { name = '', onClick, duration = 1500, className, block = true, icon } = props
  const clickHandler = () => {
    /**开启防抖 */
    setLoading(true)
    typeof onClick === 'function' && onClick()
    setTimeout(() => {
      setLoading(false)
    }, duration)
  }
  return (

    <Button
      // loading={loading}
      type="success"
      onClick={clickHandler}
      className={classNames(styles.button, className)}
      block={block}
      icon={icon}
      color="linear-gradient( 162deg, #0092F4 0%, #1377FE 100%)"
    >
      {name}
    </Button>
  )
}
export default CommonButton