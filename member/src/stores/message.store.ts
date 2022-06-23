import { defineStore } from 'pinia';
import type { Message } from '@pork-buns/core/types/common';
import { useApi } from '@/plugins/memberApi.plugin';
import type { ApiResDataWithPagination } from '@pork-buns/core/types/api';

export const useMessageStore = defineStore('message', () => {
  const api = useApi();

  async function fectMessages (page: number, size = 20) {
    const res = await api.post<ApiResDataWithPagination<Message[]>>('service/API/Message/ListAsync', {
      PageIndex: page,
      PageSize: size
    });

    return res;
  }

  function deleteMessage (messageId: Message['InternalMailID']) {
    return api.post('service/API/Message/DeleteAsync', {
      InternalMailID: messageId
    });
  }

  function readMessage (messageId: Message['InternalMailID']) {
    return api.post('service/API/Message/ReadAsync', {
      InternalMailID: messageId
    });
  }

  return {
    fectMessages,
    deleteMessage,
    readMessage
  };
});
