import en from './en';
import zh from './zh';
import mo from './mo';

export default function get(value) {
  return {
    en: en(value),
    zh: zh(value),
    mo: mo(value)
  };
}
