import { inject, type InjectionKey, type Plugin } from 'vue';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiErrorData } from '../types/api';
import { useAccessToken } from '../compositions/useAccessToken';
import { useEnvStore } from '../stores/env.store';

const apiProvideKey: InjectionKey<AxiosInstance> = Symbol.for('api');

const parentReferrer = (window.location.ancestorOrigins && window.location.ancestorOrigins[0]) || document.referrer;

export function createApi (cb: (api: AxiosInstance) => void): Plugin {
  return {
    install (app, options?: AxiosRequestConfig) {
      const envStore = useEnvStore();
      const $token = useAccessToken();

      const api = axios.create({
        baseURL: envStore.apiUrl,
        ...options
      });

      // add access token if it existing
      api.interceptors.request.use(onFulfilledRequestHandler);

      function onFulfilledRequestHandler (config: AxiosRequestConfig<any>) {
        config.headers = config.headers || {};

        if ($token.accessToken) {
          config.headers['Authorization'] = `Bearer ${$token.accessToken}`;
          config.headers['DeviceTypeGroupID'] = '4';
          config.headers['DeviceTypeID'] = '3';
        }

        // headers[ParentOrigin]
        config.headers['ParentOrigin'] = parentReferrer;

        return config;
      }

      app.provide(apiProvideKey, api);
      cb(api);
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