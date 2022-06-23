import { useApi } from '@/plugins/memberApi.plugin';
import { defineStore } from 'pinia';
import type { BetRecord, BetRecordQuery } from '@pork-buns/core/types/betRecord';
import type { ApiResDataWithPagination } from '@pork-buns/core/types/api';

export const useBetRecordStore = defineStore('betRecord', () => {
  const api = useApi();

  async function fetchBetRecord (query: BetRecordQuery) {
    const res = await api.post<ApiResDataWithPagination<BetRecord[]>>('service/API/BetRecord/ListAsync', query);

    return res;
  }

  return {
    fetchBetRecord
  };
});
