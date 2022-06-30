import type { CountryEnum } from '@pork-buns/core/const/common.const';
import type { City, Province } from '@pork-buns/core/types/common';
import { defineStore } from 'pinia';
import { computed, ref, watchEffect, type Ref } from 'vue';
import { useCommonApi } from '@pork-buns/core/api/common.api';
import type { Bank } from '@pork-buns/core/types/bank';

export const useCommonStore = defineStore('common', () => {
  const commonApi = useCommonApi();
  const countries = ref<Record<CountryEnum, Province[]>>();
  const cities = ref<City[]>([]);
  const banks = ref<Bank[]>([]);
  const bankIdMap = computed(() => Object.fromEntries(banks.value.map(row => [row.BankID, row])));

  async function fetchCityList () {
    const res = await commonApi.fetchCities();

    cities.value = res.data.Data;
  }

  async function fetchProvinces (countryID: CountryEnum, forceFetch = false) {
    if (forceFetch === false && countries.value?.[countryID]) {
      return countries.value[countryID];
    }

    const res = await commonApi.fetchProvinces(countryID);
    const provinces = res.data.Data;

    countries.value = Object.assign({}, countries.value, { [countryID]: provinces });

    return countries.value[countryID];
  }

  async function fetchBanks () {
    const res = await commonApi.fetchBanks();

    banks.value = res.data.Data;
  }

  void fetchCityList();
  void fetchBanks();

  return {
    countries,
    cities,
    banks,
    bankIdMap,
    fetchCityList,
    fetchProvinces,
    fetchBanks
  };
});

export function useProvinces (countryID: Ref<CountryEnum> | CountryEnum) {
  const commonStore = useCommonStore();
  const countryIdRef = ref(countryID);
  const provinces = ref<Province[]>([]);

  watchEffect(() => {
    void commonStore.fetchProvinces(countryIdRef.value).then(p => provinces.value = p);
  });

  return {
    provinces
  };
}

/** @deprecated */
export const useProvince = useCities;
export function useCities (p: Ref<Province> | Province) {
  const province = ref(p);
  const commonStore = useCommonStore();
  const cities = ref<City[]>([]);

  watchEffect(() => {
    cities.value = commonStore.cities.filter((city) => city.ProvinceID === province.value.ProvinceID);
  });

  return {
    province,
    cities
  };
}