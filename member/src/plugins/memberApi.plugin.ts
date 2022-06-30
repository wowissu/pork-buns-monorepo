export * from '@pork-buns/core/plugins/api.plugin';

import type { Plugin } from 'vue';
import type { AxiosRequestConfig } from 'axios';
import type { ApiAxiosResponse } from '@pork-buns/core/types/api';
import type { QVueGlobals } from 'quasar';
import { createApi, type ApiAxiosError } from '@pork-buns/core/plugins/api.plugin';

export function createMemberApi (): Plugin {
  return {
    install (app, options?: AxiosRequestConfig) {
      const apiPlugin = createApi((api) => {
        api.interceptors.response.use(onFulfilledResponseHandler, onRejectedResponseHandler);

        function onFulfilledResponseHandler (response: ApiAxiosResponse<unknown>) {
          const $q = app.config.globalProperties.$q as QVueGlobals;
          const useRawResponseData = response.config.useRawResponseData;

          if (response.status !== 200 || response.data === undefined || response.data === null) {
            $q.notify({
              message: response.config.overrideError?.message ?? '连线发生错误',
              color: 'negative'
            });

            return Promise.reject(response);
          } else if (!useRawResponseData && !response.data.Success) {
            $q.notify({
              message: `${response.data.Message}(${response.data.Code})`,
              color: 'negative'
            });

            return Promise.reject(response);
          }

          return response;
        }

        function onRejectedResponseHandler (err: ApiAxiosError) {
          const $q = app.config.globalProperties.$q as QVueGlobals;

          $q.notify({
            message: err.config.overrideError?.message ?? err.response?.data.error_description ?? '连线发生错误',
            color: 'negative'
          });

          return Promise.reject(err);
        }
      });

      apiPlugin.install?.(app, options);
    }
  };
}
