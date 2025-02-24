import { Loading, Overlay } from '@nutui/nutui-react-taro'
import { useSelector } from 'react-redux';


const GlobalLoading = () => {
  const visible = useSelector((state: any) => {
    return state.app.globalLoading
  });
  const WrapperStyle = {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <Overlay visible={visible}>
      <div className="wrapper" style={WrapperStyle}>
        <Loading direction="vertical" type="spinner">加载中</Loading>
      </div>
    </Overlay>
  )
}
export default GlobalLoading