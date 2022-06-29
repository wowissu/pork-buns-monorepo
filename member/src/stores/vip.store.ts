import { defineStore } from 'pinia';
import { type VIPPrivilege, type VIPLevel, VIPColumnEnum } from '@pork-buns/core/types/vip';
import { ref } from 'vue';
import { useVipApi } from '@pork-buns/core/api/member.api';

export function isVIPColumn (key: any): key is VIPColumnEnum {
  return Object.values(VIPColumnEnum).includes(key);
}

export const useVIPStore = defineStore('vip', () => {
  const vipApi = useVipApi();
  const privileges = ref<VIPPrivilege[]>([]);
  const levels = ref<VIPLevel[]>([]);

  async function fetchVIPSystem () {
    const res = await vipApi.fetchVipSystem();

    levels.value = res.data.Data.Vipsystem.map((v) => ({ ...v, LevelID: v.Level }));
    privileges.value = res.data.Data.VipPrivileges;
  }

  void fetchVIPSystem();

  return {
    levels,
    privileges,
    fetchVIPSystem
  };
});
