import { $date } from '../compositions/useDate';
import { $copy } from '../compositions/useCopy';
import { $currency } from '../compositions/useCurrency';
import type { Plugin } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $date: typeof $date
    $copy: typeof $copy
    $currency: (val: string | number) => string
  }
}

export function propertiesPlugin (): Plugin {
  return {
    install (app) {
      app.config.globalProperties.$date = $date;
      app.config.globalProperties.$copy = $copy;
      app.config.globalProperties.$currency = $currency;
    }
  };
}