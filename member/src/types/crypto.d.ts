import type { ContractEnum } from '@/const/crypto.const';

export interface SmartContractOption {
  label: string;
  value: ContractEnum
}

export interface CryptoWallet {
  IsValid: 1 | 0
  SID: number
  UsdtAddress: string
  UsdtType: string
}

export interface AddCryptoWalletPostdata {
  Password: string,
  BankPassword: string,
  UsdtType: ContractEnum,
  UsdtAddress: string
}