export enum ContractEnum {
  TRC20 = 'TRC20',
  ERC20 = 'ERC20'
}

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
  Address: string
}