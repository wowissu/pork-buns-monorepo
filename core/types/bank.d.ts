export interface BaseInput {
  password: string
  bankPassword: string
  name: string
  resolve: (val?: unknown) => void
}

export interface Bank {
  BankEName: string
  BankID: number
  BankName: string
}

/** Bank acount also means bankcard at backend api */
export interface BankAcount {
  AccountName: string
  BankAccount: string
  BankBranch: string
  BankCity: string
  BankEName: string
  BankID: number
  BankProvinceID: number
  IsValid: 1 | 0
  SID: number
}

export interface AddBankAccountPostdata {
  Password: string
  BankPassword: string
  AccountName: string
  BankID: number
  BankBranch: string
  BankAccount: string
  BankProvinceID: number
  BankCity: number
}