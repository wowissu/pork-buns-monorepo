import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@/types/api';
import type { BankAcount } from '@/types/bank';
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
