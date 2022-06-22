import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createMemberApi } from '@/plugins/memberApi.plugin';
import { createAppI18n } from '@pork-buns/core/plugins/i18n.plugin';
import { createQuasar } from '@/plugins/quasar.plugin';

import App from './App.vue';
import router from './router';
import { propertiesPlugin } from '@pork-buns/core/plugins/properties.plugin';

const app = createApp(App);

(async function () {
  app.use(createPinia());
  app.use(await createAppI18n());
  app.use(createMemberApi());
  app.use(createQuasar());
  app.use(propertiesPlugin());
  app.use(router);

  app.mount('#app');
})();
