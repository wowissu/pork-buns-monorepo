import { useLoading } from '@/compositions/useLoading';
import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import type { Game } from '@pork-buns/core/types/game';
import numeral from 'numeral';
import { defineStore } from 'pinia';
import { ref, toRef } from 'vue';

export const $allBalanceLoading = useLoading();

export const useGameStore = defineStore('game', () => {
  const api = useApi();
  const games = ref<Game[]>([]);
  const gameBalances = ref<Partial<Record<Game['PlatformEName'], number | null>>>({});

  void fetchGameList().then(() => updateAllGamesBalance());

  async function fetchGameList () {
    const res = await api.post<ApiResponseData<Game[]>>('/service/API/Game/ListAsync');

    games.value = res.data.Data.sort((a, b) => a.Sequence - b.Sequence);
  }

  async function fetchGameCredit (game: Game) {
    const row = toRef(gameBalances.value, game.PlatformEName);

    row.value = null;

    const res = await api.post<ApiResponseData<{ Balance: string }>>('/service/API/Credit/GameAsync', {
      GameName: game.PlatformEName
    });

    row.value = numeral(res.data.Data.Balance).value();
  }

  async function updateAllGamesBalance () {
    try {
      $allBalanceLoading.start();

      const res = await api.post<ApiResponseData<{ GameName: string, Balance: string }[]>>('/service/API/Credit/MultipleGameAsync', {
        GameNames: games.value.map((row) => row.PlatformEName)
      });

      gameBalances.value = res.data.Data.reduce((acc, row) => {
        acc[row.GameName] = numeral(row.Balance).value();

        return acc;
      }, {} as Record<string, number | null>);
    } catch (err) {
      console.error(err);
    } finally {
      $allBalanceLoading.done();
    }
  }

  function useGameBalance (game: Game) {
    return toRef(gameBalances.value, game.PlatformEName);
  }

  function getGameBalance (game: Game) {
    return gameBalances.value[game.PlatformEName] ?? null;
  }

  return {
    games,
    fetchGameList,
    fetchGameCredit,
    updateAllGamesBalance,
    useGameBalance,
    getGameBalance
  };
});