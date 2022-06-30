import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $copyNotify: (val: string) => Promise<void>
  }
}