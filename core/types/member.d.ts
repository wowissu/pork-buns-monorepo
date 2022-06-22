/* eslint-disable @typescript-eslint/naming-convention */

import type { GenderEnum } from '@/const/common.const';
import type { Province } from '@/types/common';

export interface MemberLoginUserInput {
  userName: string
  password: string
  verifyKey: string
  verifyCode: string
}

export interface MemberLoginPostdata extends MemberLoginUserInput {
  grant_type: 'password'
  // deviceType: undefined
  resolution: string
  userAgent: string
}

export interface MemberLoginResponse {
  '.expires': string
  '.issued': string
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

export interface Member {
  Account: string
  Name: string
  Address: string
  BirthDay: string
  CreateDate: string
  LastLoginDate: string
  Email: string
  CellPhone: string
  JVCODE: string
  LevelEName: string
  QQ: string
  UserIdentity: string
  NickName: string | null
  Sex: GenderEnum
  VIPLevel: number
  Percentage: number
  EmailStatus: 1 | 0
  MemberBank: 1 | 0
  CellPhoneStatus: 1 | 0
  ProvinceID: Province['ProvinceID'],
  BankPasswordStatus: 1 | 0,

  // BankAccount: null
  // BankBranch: null
  // BankCity: null
  // BankID: 0
  // BankProvince: null
  // BankProvinceID: 0
  // CanApplyRescueGift: 0
  // City: ''
  // HostID: 0

  // Note_BankAccount: null
  // Note_CellPhone: null
  // Note_IP: null
  // PTLevel: 0
  // PassHBOMovie: 0

  // SecurityAnswer: ''
  // SecurityQuestion: 0
  // WeChat: ''
}

export interface MemberEditPostdata {
  // MemberID: number,
  Sex: GenderEnum,
  BirthDay: string,
  UserIdentity: string,
  QQ: string,
  Name: string,
  NickName: string
  ProvinceID?: Province['ProvinceID'],
  Address?: string,
}

export interface MemberVIP {
  GapDeposit: number
  GapGameTotalBet: number
  IsValid: number
  KeepGapDeposit: number
  NextLevel: number
  NextLevelEName: string
  NowLevel: number
  NowLevelEName: string
  Percentage: number
}