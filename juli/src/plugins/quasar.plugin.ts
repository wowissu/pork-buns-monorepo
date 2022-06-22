import { Quasar, Notify, Dialog, Ripple, type QuasarPluginOptions } from 'quasar';
import type { Plugin } from 'vue';

// import '@quasar/extras/material-icons/material-icons.css';
import iconSet from 'quasar/icon-set/mdi-v6';
import langZhCN from 'quasar/lang/zh-CN';
import '@quasar/extras/mdi-v6/mdi-v6.css';
import 'quasar/src/css/index.sass';

declare module 'quasar' {
  interface QInput {
    hasError: boolean;
  }
}

export function createQuasar (): Plugin {
  return {
    install (app) {
      app.use(Quasar, {
        lang: langZhCN,
        iconSet,
        plugins: {
          Notify,
          Dialog
        },
        directives: {
          Ripple
        },
        config: {
          notify: { /* look at QuasarConfOptions from the API card */ }
        }
      } as QuasarPluginOptions);
    }
  };
}