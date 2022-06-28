import type { ApiPagination } from 'types/api';

export enum TransactionTypeEnum {
  // $t('common.TransactionTypeEnum.Deposit')
  Deposit = 'Deposit',
  // $t('common.TransactionTypeEnum.Withdrawals')
  Withdrawals = 'Withdrawals',
  // $t('common.TransactionTypeEnum.Transfer')
  Transfer = 'Transfer',
  // $t('common.TransactionTypeEnum.Preferential')
  Preferential = 'Preferential',
  // $t('common.TransactionTypeEnum.Others')
  Others = 'Others',
}

export enum TransactionDateTypeEnum {
  // $t('common.TransactionDateTypeEnum.today')
  Today = 'today',
  // $t('common.TransactionDateTypeEnum.yesterday')
  Yesterday = 'yesterday',
  // $t('common.TransactionDateTypeEnum.nearly7days')
  Nearly7days = 'nearly7days',
  // $t('common.TransactionDateTypeEnum.nearly15days')
  Nearly15days = 'nearly15days',
  // $t('common.TransactionDateTypeEnum.nearly30days')
  Nearly30days = 'nearly30days',
  // $t('common.TransactionDateTypeEnum.all')
  All = 'all',
}

export enum TransferStatusEnum {
  // $t('transactionRecord.TranferStatusEnum.0')
  Error = 0,
  // $t('transactionRecord.TranferStatusEnum.1')
  Success = 1,
  // $t('transactionRecord.TranferStatusEnum.2')
  Failure = 2,
  // $t('transactionRecord.TranferStatusEnum.3')
  Unlock = 3,
  // $t('transactionRecord.TranferStatusEnum.4')
  Lock = 4,
}

export interface TransactionRecordQuery {
  DayType: TransactionDateTypeEnum,
  TransactionType: TransactionTypeEnum,
  Pagination: Pick<ApiPagination, 'PageIndex' | 'PageSize'>
}

export interface DepositRecord {
  Amount: number
  BillNo: string
  ClosedDate: string | null
  CreateDate: string
  DepositType: null
  DepositTypeName: string
  DeviceType: string
  ProcessType: number
  Status: number
}

export interface WithdrawalRecord {
  WithdrawBillNo: string
  WithdrawID: number
  Amount: number
  BankAccount: string
  CreateDate: string
  DeviceType: string
  NoteForFrontstage: string
  ProcessType: number
  Status: number
}

export interface TransferRecord {
  ExchangeBillNo: string
  ChangePoint: number
  CreateDate: string
  InWalletCName: string
  Note: string
  OutWalletCName: string
  Status: TransferStatusEnum
}

export interface PreferentialRecord {
  ChangePoint: number
  CreateDate: string
  PreferentialNote: string
  PreferentialTypeEName: string
}

export interface OthersRecord {
  Amount: number
  Note: string
  NoteComplete: string
  Status: number
  StatusEName: string
  TakeDate: string
  TypeName: string
}
