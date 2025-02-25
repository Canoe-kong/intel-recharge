import { Picker, PickerOption } from '@nutui/nutui-react-taro';
import { ArrowDown } from '@nutui/icons-react-taro';
import i18n from 'taro-i18n';
import classNames from 'classnames';
import styles from './index.module.less';
import { cache, cacheKey } from '@/cache';
import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import utils from '@/utils';
interface ChangeLanguageProps {
  className?: string;
  changeSuccessCallBack?: () => void;
  visible?: boolean;
  onClose?: () => void;
}

const ChangeLanguage = (props: ChangeLanguageProps) => {

  const { className, changeSuccessCallBack, visible, onClose } = props;

  const getLanguageList = () => {
    return [
      { text: utils.intl('Traditional'), value: 'mo' },
      { text: utils.intl('English'), value: 'en' },
      { text: utils.intl('Simplified'), value: 'zh' }
    ];
  }

  const [selectorChecked, setSelectorChecked] = useState<string | number>(getLanguageList()[2].text);
  const [sortLanguage, setSortLanguage] = useState(getLanguageList());
  const [selectorItemValue, setSelectorItemValue] = useState([getLanguageList()[2].value]);
  useEffect(() => {
    const curLanguageType = cache.get(cacheKey.INTL);
    const _selectorItemIndex = getLanguageList().findIndex((item) => item.value === curLanguageType);
    setSelectorChecked(_selectorItemIndex > -1 ? getLanguageList()[_selectorItemIndex].text : '');
    setSelectorItemValue([curLanguageType]);
  }, [])


  const onChangeLanguage = (selectedOptions: PickerOption[], selectedValues: string[]) => {
    const curSelecTor = selectedOptions[0];
    i18n.t.setLocale(curSelecTor.value);
    const languageList = getLanguageList()
    console.log('languageList', languageList)
    setSelectorChecked(languageList.find(item => item.value === curSelecTor.value)?.text);
    setSelectorItemValue(selectedValues);
    setSortLanguage(languageList)
    cache.set(cacheKey.INTL, curSelecTor.value);
    changeSuccessCallBack?.();
  };

  return (
    <View className={classNames(styles.changeLanguage, className)}>
      <View className={styles.textWrapper}>
        <View className={styles.text}>{selectorChecked}</View>
        <ArrowDown size={15} style={{ marginLeft: '4px' }} />
      </View>
      <Picker
        options={sortLanguage}
        onConfirm={onChangeLanguage}
        visible={visible}
        onCancel={onClose}
        value={selectorItemValue}
      >
      </Picker>
    </View>
  );
}

export default ChangeLanguage;


