import { Picker, PickerOption } from '@nutui/nutui-react-taro';
import classNames from 'classnames';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import utils from '@/utils';
interface ChangeLanguageProps {
  className?: string;
  changeSuccessCallBack?: (option: any) => void;
  visible?: boolean;
  onClose?: () => void;
}

const AreaCodePicker = (props: ChangeLanguageProps) => {

  const { className, changeSuccessCallBack, visible, onClose } = props;

  useEffect(() => {
    if (visible) {
      setSortAreaList(getAreaList())
    }
  }, [visible])

  const getAreaList = () => {
    return [
      { text: `${utils.intl('macau')} (+853)`, value: '853' },
      { text: `${utils.intl('mainland')} (+86)`, value: '86' },
      { text: `${utils.intl('hk')} (+852)`, value: '852' }
    ];
  }

  const [selectorChecked, setSelectorChecked] = useState<string | number>(getAreaList()[0].value);
  const [sortAreaList, setSortAreaList] = useState(getAreaList());


  const onChange = (selectedOptions: PickerOption[], selectedValues: string[]) => {
    setSelectorChecked(selectedValues[0])
    changeSuccessCallBack?.(selectedValues[0]);
  };

  return (
    <View className={classNames(styles.changeTelArea, className)}>
      <View className={styles.textWrapper}>
        <span>+</span>
        <View className={styles.text}>{selectorChecked}</View>
        <img src={require('@/assets/images/login/down-icon.png')} className={styles.arrowDown} />
      </View>
      <Picker
        options={sortAreaList}
        onConfirm={onChange}
        visible={visible}
        onCancel={onClose}
      // indicator-style={styles.selectPicker}
      >
      </Picker>
    </View>
  );
}

export default AreaCodePicker;


