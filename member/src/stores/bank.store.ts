import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import type { Bank, AddBankAccountPostdata } from '@pork-buns/core/types/bank';
import { defineStore } from 'pinia';
import { computed, ref, unref } from 'vue';

export const useBankStore = defineStore('bank', () => {
  const api = useApi();
  const bankList = ref<Bank[]>([]);
  const bankIdMap = computed(() => Object.fromEntries(unref(bankList).map(row => [row.BankID, row])));

  void fetchBankList();

  async function fetchBankList (source = 2) {
    const res = await api.get<ApiResponseData<Bank[]>>('service/API/Bank/ListAsync', { params: { source } });

    bankList.value = res.data.Data;
  }

  async function verifyBeforeAddBankAccount (password: string, bankPassword: string) {
    const res = await api.post('service/API/MemberWithdrawBank/AddValidateAsync', {
      Password: password,
      BankPassword: bankPassword
    });

    return res;
  }

  async function addBankAccount (postdata: AddBankAccountPostdata) {
    const res = await api.post('service/API/MemberWithdrawBank/AddAsync', postdata);

    return res;
  }

  return {
    bankIdMap,
    bankList,
    fetchBankList,
    addBankAccount,
    verifyBeforeAddBankAccount
  };
});
