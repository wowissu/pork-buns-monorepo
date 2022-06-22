import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Message } from '@pork-buns/core/types/common';
import { useApi } from '@/plugins/api.plugin';
import type { ApiResDataWithPagination } from '@pork-buns/core/types/api';
import { useQuasar } from 'quasar';

// import rows from '@/../mock/MOCK_DATA.json';
// const mockRows = rows as Message[];

export const useMessageStore = defineStore('message', () => {
  const api = useApi();

  const $q = useQuasar();
  const messages = ref<Message[]>([]);
  const pageSize = ref(20);
  const totalCount = ref(0);
  const pageCount = computed(() => Math.ceil(totalCount.value / pageSize.value));

  const deletedMessagesId = ref<Message['InternalMailID'][]>([]);
  const filteredMessages = computed(() => messages.value.filter(row => !deletedMessagesId.value.includes(row.InternalMailID)));

  async function fectMessages (page: number, size = pageSize.value): Promise<Message[]> {
    const startIndex = page * size - 1;

    const res = await api.post<ApiResDataWithPagination<Message[]>>('service/API/Message/ListAsync', {
      PageIndex: page,
      PageSize: size
    });

    totalCount.value = res.data.Pagination.TotalCount;
    messages.value = insert(messages.value, startIndex, ...res.data.Data);

    return res.data.Data;
  }

  async function deleteMessage (messageId: Message['InternalMailID']) {
    await api.post('service/API/Message/DeleteAsync', {
      InternalMailID: messageId
    });

    deletedMessagesId.value = [...deletedMessagesId.value, messageId];

    $q.notify({
      message: '信息删除成功',
      color: 'positive'
    });
  }

  async function readMessage (messageId: Message['InternalMailID']) {
    const res = await api.post('service/API/Message/ReadAsync', {
      InternalMailID: messageId
    });

    const message = messages.value.find(m => m.InternalMailID === messageId);

    message && (message.IsRead = 1);

    return res;
  }

  return {
    messages: filteredMessages,
    totalCount,
    pageCount,
    pageSize,
    fectMessages,
    deleteMessage,
    readMessage
  };
});

// function getRandomArbitrary (min:number, max:number) {
//   return Math.random() * (max - min) + min;
// }

function insert<T> (arr: T[], index: number, ...newItems: T[]): T[] {
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted items
    ...newItems,
    // part of the array after the specified index
    ...arr.slice(index)
  ];
}