import type { ApiAxiosResponseWithPagination, ApiResDataWithPagination } from '../types/api';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import type { BetRecord, BetRecordQuery } from '../types/betRecord';
import type { DepositRecord, OthersRecord, PreferentialRecord, TransactionRecordQuery, TransactionTypeEnum, TransferRecord, WithdrawalRecord } from '../types/transactionRecord';

export const useRecordApi = defineStore('recordApi', () => {
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
    fetchBetRecords: (query: BetRecordQuery) => api.post<ApiResDataWithPagination<BetRecord[]>>('service/API/BetRecord/ListAsync', query),
    fetchRecord
  }
});