import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createApi } from '@/plugins/api.plugin';
import { createAppI18n } from '@/plugins/i18n.plugin';
import { createQuasar } from '@/plugins/quasar.plugin';

import App from './App.vue';
import router from './router';
import { propertiesPlugin } from '@/plugins/properties.plugin';

const app = createApp(App);

(async function () {
  app.use(createPinia());
  app.use(await createAppI18n());
  app.use(createApi());
  app.use(createQuasar());
  app.use(propertiesPlugin());
  app.use(router);

  app.mount('#app');
})();
