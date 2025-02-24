import React, { Component } from 'react';
import { View } from '@tarojs/components';

function createErrorBoundary(Page) {
  return class ErrorBoundary extends Component {
    el = React.createRef<{ componentDidShow?: () => void; componentDidHide?: () => void; onShareAppMessage?: () => void }>();
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

    componentDidShow() {
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
}

export default createErrorBoundary;