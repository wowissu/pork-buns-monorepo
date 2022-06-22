import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import type { BankAcount } from '@pork-buns/core/types/bank';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWithdrawalStore = defineStore('withdrawal', () => {
  const api = useApi();
  const bankAccountList = ref<BankAcount[]>([]);

  async function fetchBankAccountList () {
    const res = await api.post<ApiResponseData<BankAcount[]>>('service/API/MemberWithdrawBank/ListAsync');

    bankAccountList.value = res.data.Data;

    return res;
  }

  return {
    bankAccountList,
    fetchBankAccountList
  };
});
