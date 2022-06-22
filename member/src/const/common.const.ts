export const timeFormat = 'HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
export const datetimeFormat = 'YYYY-MM-DD HH:mm:ss';
export const datetimeNoSecFormat = 'YYYY-MM-DD HH:mm';
export const datePostFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export enum CountryEnum {
  China = 0
}

export enum GenderEnum {
  Unknown = -1,
  Female = 0,
  Male = 1
}

export enum LocaleEnum {
  // i18n.t('common.langs[en]');
  'en' = 'en',
  // i18n.t('common.langs[en]');
  'en-us' = 'en',
  // i18n.t('common.langs[zh-tw]');
  'zh-tw' = 'zh-tw',
  // i18n.t('common.langs[zh-cn]');
  'zh-cn' = 'zh-cn',
}