import { LocaleEnum } from '../const/common.const';

export const localeMessagesImport = {
  [LocaleEnum.en]: () => import ('./en'),
  [LocaleEnum['zh-cn']]: () => import ('./zh-CN')
};
