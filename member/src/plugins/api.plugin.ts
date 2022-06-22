import { inject, type InjectionKey, type Plugin } from 'vue';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiAxiosResponse, ApiErrorData } from '@pork-buns/core/types/api';
import { useAccessToken } from '@/compositions/useAccessToken';
import { useAppStore } from '@/stores/app.store';
import type { QVueGlobals } from 'quasar';

const apiProvideKey: InjectionKey<AxiosInstance> = Symbol.for('api');

export function createApi (): Plugin {
  return {
    install (app, options?: AxiosRequestConfig) {
      const appStore = useAppStore();
      const $token = useAccessToken();

      const api = axios.create({
        baseURL: appStore.apiUrl,
        ...options
      });

      // add access token if it existing
      api.interceptors.request.use(onFulfilledRequestHandler);
      api.interceptors.response.use(onFulfilledResponseHandler, onRejectedResponseHandler);

      function onFulfilledRequestHandler (config: AxiosRequestConfig<any>) {
        config.headers = config.headers || {};

        if ($token.accessToken) {
          config.headers['Authorization'] = `Bearer ${$token.accessToken}`;
          config.headers['DeviceTypeGroupID'] = '4';
          config.headers['DeviceTypeID'] = '3';
        }

        // headers[ParentOrigin]
        config.headers['ParentOrigin'] = (window.location.ancestorOrigins && window.location.ancestorOrigins[0]) || document.referrer;

        return config;
      }

      function onFulfilledResponseHandler (response: ApiAxiosResponse<unknown>) {
        const $q = app.config.globalProperties.$q as QVueGlobals;
        const useRawResponseData = response.config.useRawResponseData;

        if (response.status !== 200 || response.data === undefined || response.data === null) {
          $q.notify({
            message: response.config.error?.message ?? '连线发生错误',
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
          message: err.config.error?.message ?? err.response?.data.error_description ?? '连线发生错误',
          color: 'negative'
        });

        return Promise.reject(err);
      }

      app.provide(apiProvideKey, api);
    }
  };
}

export function useApi () {
  const result = inject(apiProvideKey);

  if (result === undefined) {
    throw new Error('Api instance is not injected');
  }

  return result;
}

export function isAxiosError<T> (err: unknown): err is AxiosError<T>  {
  return err instanceof AxiosError;
}

export function isApiAxiosError<T extends ApiErrorData> (err: unknown): err is ApiAxiosError<T> {
  return err instanceof AxiosError && err.response?.data.error;
}

export class ApiAxiosError<T = ApiErrorData> extends AxiosError<T> {}