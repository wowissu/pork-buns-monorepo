import type { Plugin, ComponentCustomProperties } from 'vue';

export function copyNotifyPlugin (): Plugin {
  return {
    install (app) {
      app.config.globalProperties.$copyNotify = function $copyNotify (this: ComponentCustomProperties, val: string) {
        return this.$copy(val).then(() => {
          this.$q.notify({
            message: this.$t('common.copy', [val])
          });
        });
      };
    }
  };
}