import { useLoading } from '@pork-buns/core/compositions/useLoading';
import type { Game, Wallet } from '@pork-buns/core/types/game';
import numeral from 'numeral';
import { defineStore } from 'pinia';
import { ref, toRef, watchEffect } from 'vue';
import { useGameApi } from '@pork-buns/core/api/game.api';

export const $allBalanceLoading = useLoading();

export const mainWallet: Wallet = {
  PlatformID: 9999,
  PlatformEName: 'Main',
  ShowName: '中心钱包',
  Sequence: 0
};

export const useGameStore = defineStore('game', () => {
  const gameApi = useGameApi();
  const games = ref<Game[]>([]);
  const wallets = ref<Wallet[]>([]); // Will include main-wallet
  const gameBalances = ref<Partial<Record<Game['PlatformEName'], number | null>>>({});
  // const gameAudits = ref<Partial<Record<Game['PlatformEName'], GameAudit>>>({});

  // wallets handlers
  watchEffect(() => {
    wallets.value = [
      mainWallet,
      ...games.value.map((game) => ({
        PlatformID: game.PlatformID,
        PlatformEName: game.PlatformEName,
        ShowName: game.ShowName,
        Sequence: game.Sequence
      }))
    ];
  });

  void fetchGameList().then(() => updateAllGamesBalance());

  async function fetchGameList () {
    const res = await gameApi.fetchList();

    games.value = res.data.Data.sort((a, b) => a.Sequence - b.Sequence);
  }

  async function fetchGameCredit (game: Game) {
    const row = toRef(gameBalances.value, game.PlatformEName);

    row.value = null;

    const res = await gameApi.fetchGameCredit(game.PlatformEName);

    row.value = numeral(res.data.Data.Balance).value();
  }

  async function updateAllGamesBalance () {
    try {
      $allBalanceLoading.start();

      const res = await gameApi.fetchGamesCredit(games.value.map((row) => row.PlatformEName));

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

  // function getGameBalance (game: Game) {
  //   return gameBalances.value[game.PlatformEName] ?? null;
  // }

  function isMainWallet (w: Wallet) {
    return w.PlatformID === mainWallet.PlatformID;
  }

  return {
    games,
    wallets,
    mainWallet,
    fetchGameList,
    fetchGameCredit,
    updateAllGamesBalance,
    useGameBalance,
    // getGameBalance,
    isMainWallet
  };
});