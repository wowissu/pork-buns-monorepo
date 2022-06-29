import type { ApiResDataWithPagination } from '../types/api';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import type { Message } from '../types/common';

export const useMessageApi = defineStore('messageApi', () => {
  const api = useApi();

  return {
    fectMessages: (pageIndex: number, pageSize: number) => api.post<ApiResDataWithPagination<Message[]>>('service/API/Message/ListAsync', { PageIndex: pageIndex, PageSize: pageSize }),
    deleteMessage: (internalMailID: Message['InternalMailID']) => api.post('service/API/Message/DeleteAsync', { InternalMailID: internalMailID }),
    readMessage: (internalMailID: Message['InternalMailID']) => api.post('service/API/Message/ReadAsync', { InternalMailID: internalMailID })
  };
});
