import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from '@/model/features/app';

function createErrorBoundary(Page) {
  class ErrorBoundary extends Component {
    el = React.createRef<{ componentDidShow?: () => void; componentDidHide?: () => void; onShareAppMessage?: () => void; componentDidMount?: () => void }>();
    state = {
      hasError: null,
    };

    static getDerivedStateFromError() {
      return {
        hasError: true,
      };
    }

    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }

    componentDidMount() {
      showLoading();
      return this.el.current?.componentDidMount?.();
    }

    componentDidShow() {
      hideLoading()
      return this.el.current?.componentDidShow?.();
    }

    componentDidHide() {
      return this.el.current?.componentDidHide?.();
    }

    onShareAppMessage() {
      return this.el.current?.onShareAppMessage?.();
    }

    render() {
      const ForwardedPage = React.forwardRef((props, ref) => <Page ref={ref} {...props} />);
      return this.state.hasError ? (
        <View>Something went wrong.</View>
      ) : (
        <ForwardedPage ref={this.el} />
      );
    }
  };
  return connect((state) => {
    console.group('redux数据');
    console.log(`%c 新值`, `color: #03A9F4; font-weight: bold`, state);
    // console.log(`%c 时间`, `color: #4CAF50; font-weight: bold`, dayjs().format('MM-DD HH:mm:ss'));
    console.groupEnd();
    return state;
  }, { showLoading, hideLoading })(ErrorBoundary);
}

export default createErrorBoundary;