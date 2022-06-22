import { defineStore } from 'pinia';
import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import { type VIPPrivilege, type VIPLevel, VIPColumnEnum, type ApiVIPLevel } from '@pork-buns/core/types/vip';
import { ref } from 'vue';

export function isVIPColumn (key: any): key is VIPColumnEnum {
  return Object.values(VIPColumnEnum).includes(key);
}

export const useVIPStore = defineStore('vip', () => {
  const api = useApi();
  const privileges = ref<VIPPrivilege[]>([]);
  const levels = ref<VIPLevel[]>([]);

  async function fetchVIPSystem () {
    const res = await api.get<ApiResponseData<{ VipPrivileges: VIPPrivilege[], Vipsystem: ApiVIPLevel[] }>>('service/API/System/GetAsync');

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
