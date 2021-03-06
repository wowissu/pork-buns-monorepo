import { LocaleEnum } from '@pork-buns/core/const/common.const';
import { createI18n } from 'vue-i18n';
import { localeMessagesImport } from '../i18n';

export async function createAppI18n () {
  const locale = LocaleEnum['zh-cn'];

  const msgs = await localeMessagesImport[locale]();

  const i18n = createI18n({
    locale, // set locale
    fallbackLocale: 'en', // set fallback locale
    globalInjection: true,
    messages: {
      [locale]: msgs
    }
  });

  return i18n;
}