import { ApiPagination } from './api';

export interface BetRecordQuery {
  PlatformCode: string
  PlatformName: string
  GameTypeID: number
  StartDate: string
  EndDate: string
  Pagination: Pick<ApiPagination, 'PageIndex' | 'PageSize'>
}

export interface BetRecord {
  CreateDate: string
  PlatformName: string
  TransSN: string
  Status: number
  StatusText: string
  StatusTextSub: string
  WinloseAmount: number
  ValidBetAmount: number
  IsShowWinning: number
}