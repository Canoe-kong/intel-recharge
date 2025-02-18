import { useState } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { CommonButtonProps } from './type'

/**参考文档： https://nutui.jd.com/taro/react/2x/#/zh-CN/component/button */

const CommonButton = (props: CommonButtonProps) => {
  const [loading, setLoading] = useState(false)
  const { name = '', onClick, duration = 1500 } = props
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
      loading={loading}
      type="success"
      onClick={clickHandler}
    >
      {name}
    </Button>
  )
}
export default CommonButton