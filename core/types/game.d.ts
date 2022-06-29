export interface Game {
  // IsEnabled: 1 | 0
  GameCode: string
  GameTypeID: number
  PlatformEName: string
  PlatformID: number
  Sequence: number
  ShowName: string
}

export type Wallet = Pick<Game, 'PlatformEName' | 'PlatformID' | 'ShowName' | 'Sequence'>;

export interface GameAudit {
  AuditIsValid: 1 | 0
  CanTranAmount: number
  NoTranAmount: number
  PlatformAmount: number
}