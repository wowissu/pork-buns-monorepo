import type { ApiResponseData } from '../types/api';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import type { Game, GameAudit } from '../types/game';

export const useGameApi = defineStore('gameApi', () => {
  const api = useApi();

  return {
    fetchList: () => api.post<ApiResponseData<Game[]>>('/service/API/Game/ListAsync'),
    fetchGameCredit: (gameName: string) => api.post<ApiResponseData<{ Balance: string }>>('/service/API/Credit/GameAsync', { GameName: gameName }),
    fetchGamesCredit: (gameNames: string[]) => api.post<ApiResponseData<{ GameName: string, Balance: string }[]>>('/service/API/Credit/MultipleGameAsync', { GameNames: gameNames }),

    // 取得提款審核
    fetchGameAudit: (platformID: number) => api.get<ApiResponseData<GameAudit>>('/service/API/MemberWithdrawNormalAudit/GetAsync', { params: { PlatformID: platformID } }),
    // actions
    transfer: () => api.post('/service/API/Member/TransferAsync', {})
  };
});
