import { TransactionTypeEnum, TransactionDateTypeEnum } from '@pork-buns/core/types/transactionRecord';

export interface RecordCommonUserQuery {
  transactionType: TransactionTypeEnum
  dayType: TransactionDateTypeEnum,
}

// export const transactionTypeList = [
//   TransactionTypeEnum.Deposit,
//   TransactionTypeEnum.Withdrawals,
//   TransactionTypeEnum.Transfer,
//   TransactionTypeEnum.Preferential,
//   TransactionTypeEnum.Others
// ];

export const transactionDateTypeList = [
  TransactionDateTypeEnum.Today,
  TransactionDateTypeEnum.Yesterday,
  TransactionDateTypeEnum.Nearly7days,
  TransactionDateTypeEnum.Nearly15days,
  TransactionDateTypeEnum.Nearly30days,
  TransactionDateTypeEnum.All
];
