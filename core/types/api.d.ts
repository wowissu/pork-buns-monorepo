/* eslint-disable @typescript-eslint/naming-convention */

import type { AxiosResponse } from 'axios';

declare module 'axios' {

  interface AxiosRequestConfig {

    /**
     * Use overrideError
     * @deprecated
     */
    error?: { message: string }

    /**
     * Override the notify error message content in interceptors.response
     *
     * ```
     * axios.post('', data, { overrideError: { messgae: 'change default message' } });
     * ```
     */
    overrideError?: { message: string }

    /**
     * This response data is no under ApiAxiosResponse
     */
    useRawResponseData?: true;
  }
}

export interface ApiErrorData {
  error: string
  error_description: string
}

export interface ApiPagination {
  PageCount: number | null
  PageIndex: number
  PageSize: number
  TotalCount: number
}

export interface ApiResponseData<T> {
  Code: string
  Data: T,
  Guid: string,
  Message: string,
  Success: boolean
}

export interface ApiResDataWithPagination<T> extends ApiResponseData<T> {
  Pagination: ApiPagination
}

export type ApiAxiosResponse<T> = AxiosResponse<ApiResponseData<T>>;
export type ApiAxiosResponseWithPagination<T> = AxiosResponse<ApiResDataWithPagination<T>>;