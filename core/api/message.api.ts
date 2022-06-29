import type { ApiResDataWithPagination } from '../types/api';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import type { Message } from '../types/common';

export const useMessageApi = defineStore('messageApi', () => {
  const api = useApi();

  return {
    fectMessages: (PageIndex: number, PageSize: number) => api.post<ApiResDataWithPagination<Message[]>>('service/API/Message/ListAsync', { PageIndex, PageSize }),
    deleteMessage: (InternalMailID: Message['InternalMailID']) => api.post('service/API/Message/DeleteAsync', { InternalMailID }),
    readMessage: (InternalMailID: Message['InternalMailID']) => api.post('service/API/Message/ReadAsync', { InternalMailID }),
  }
})

