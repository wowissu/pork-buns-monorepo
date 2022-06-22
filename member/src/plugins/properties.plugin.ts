import { $date } from '@/compositions/useDate';
import numeral from 'numeral';
import type { Plugin } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $date: typeof $date
    $currency: (val: string | number) => string
  }
}

export function propertiesPlugin (): Plugin {
  return {
    install (app) {
      app.config.globalProperties.$date = $date;

      app.config.globalProperties.$currency = function (val: string | number) {
        return numeral(val).format('0,0[.]00');
      };
    }
  };
}