export enum VIPColumnEnum {
  // 生日礼金
  // $t('vip.columns.BirthdayGift')
  BirthdayGift = 'BirthdayGift',
  // 升级礼金
  // $t('vip.columns.UpgradeGift')
  UpgradeGift = 'UpgradeGift',
  // 保级存款
  // $t('vip.columns.DemoteTotalDeposit')
  DemoteTotalDeposit = 'DemoteTotalDeposit',
  // 流水要求
  // $t('vip.columns.TotalBet')
  TotalBet = 'TotalBet',
  // 累计存款
  // $t('vip.columns.TotalDeposit')
  TotalDeposit = 'TotalDeposit',
  // 体育返水
  // $t('vip.columns.Sport')
  // $t('vip.columns.4')
  Sport = '4',
  // 真人返水
  // $t('vip.columns.Live')
  // $t('vip.columns.2')
  Live = '2',
  // 电竞返水
  // $t('vip.columns.ESport')
  // $t('vip.columns.5')
  ESport = '5',
  // 彩票返水
  // $t('vip.columns.Lottery')
  // $t('vip.columns.3')
  Lottery = '3',
  // 电子返水
  // $t('vip.columns.Games')
  // $t('vip.columns.1')
  Games = '1',
  // 棋牌返水
  // $t('vip.columns.Chess')
  // $t('vip.columns.6')
  Chess = '6',
  // 捕鱼返水
  // $t('vip.columns.Fish')
  // $t('vip.columns.7')
  Fish = '7'
}

export interface VIPPrivilege {
  [VIPColumnEnum.Sport]: string;
  [VIPColumnEnum.Live]: string;
  [VIPColumnEnum.ESport]: string;
  [VIPColumnEnum.Lottery]: string;
  [VIPColumnEnum.Games]: string;
  [VIPColumnEnum.Chess]: string;
  [VIPColumnEnum.Fish]: string;
  [VIPColumnEnum.BirthdayGift]: number;
  [VIPColumnEnum.UpgradeGift]: number;
  LevelEName: string;
  LevelID: number;
  LevelName: string;
}

export interface ApiVIPLevel {
  [VIPColumnEnum.DemoteTotalDeposit]: number;
  [VIPColumnEnum.TotalBet]: number;
  [VIPColumnEnum.TotalDeposit]: number;
  Level: number;
  LevelEName: string;
  LevelName: string;
}

export interface VIPLevel extends ApiVIPLevel {
  LevelID: number;
}