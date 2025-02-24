import { Component } from 'react';
import { Button } from '@nutui/nutui-react-taro';
import styles from './index.module.less';
import CommonButton from '@/components/CommonButton';
import router from '@/route';
import services from '@/services';
import createErrorBoundary from '@/pages/layouts';
import { connect } from 'react-redux';

class Index extends Component {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    console.log(services)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  clickHandler() {
    console.log('clickHandler');
    router.go({ url: '/pages/telLogin/index' });
  }

  render() {
    return (
      <div className={styles.demo}>
        <div className="index">欢迎使用 NutUI React 开发 Taro 多端项目。</div>
        <div className="index">
          <Button type="primary" className="btn">
            NutUI React Button
          </Button>
          <CommonButton name="Button" onClick={this.clickHandler.bind(this)} />
        </div>
      </div>
    );
  }
}
export default connect((state) => {
    console.group('redux数据');
    console.log(`%c 新值`, `color: #03A9F4; font-weight: bold`, state);
    // console.log(`%c 时间`, `color: #4CAF50; font-weight: bold`, dayjs().format('MM-DD HH:mm:ss'));
    console.groupEnd();
    return state;
  })(createErrorBoundary(Index))
;
