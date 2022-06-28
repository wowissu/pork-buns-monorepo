import { useApi } from '@/plugins/memberApi.plugin';
import { defineStore } from 'pinia';
import type { DepositRecord, OthersRecord, PreferentialRecord, TransactionRecordQuery, TransactionTypeEnum, TransferRecord, WithdrawalRecord } from '@pork-buns/core/types/transactionRecord';
import type { ApiAxiosResponseWithPagination } from '@pork-buns/core/types/api';

export const useTransactionRecordStore = defineStore('transactionRecord', () => {
  const api = useApi();

  function fetchRecord (query: TransactionRecordQuery & { TransactionType: TransactionTypeEnum.Deposit }): Promise<ApiAxiosResponseWithPagination<DepositRecord[]>>;
  function fetchRecord (query: TransactionRecordQuery & { TransactionType: TransactionTypeEnum.Withdrawals }): Promise<ApiAxiosResponseWithPagination<WithdrawalRecord[]>>;
  function fetchRecord (query: TransactionRecordQuery & { TransactionType: TransactionTypeEnum.Transfer }): Promise<ApiAxiosResponseWithPagination<TransferRecord[]>>;
  function fetchRecord (query: TransactionRecordQuery & { TransactionType: TransactionTypeEnum.Preferential }): Promise<ApiAxiosResponseWithPagination<PreferentialRecord[]>>;
  function fetchRecord (query: TransactionRecordQuery & { TransactionType: TransactionTypeEnum.Others }): Promise<ApiAxiosResponseWithPagination<OthersRecord[]>>;
  function fetchRecord (query: TransactionRecordQuery) {
    return api.post('service/API/MemberTransaction/RecordListAsync', query);
  }

  return {
    fetchRecord
  };
});
