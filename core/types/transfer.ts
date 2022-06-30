export enum TransferDirectionEnum {
  // 轉出
  Out = 1,
  // 轉入
  In = 2
}

export interface TransferQuery {
  credit: number
  gameName: string
  type: TransferDirectionEnum
}