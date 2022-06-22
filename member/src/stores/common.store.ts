import { CountryEnum } from '@pork-buns/core/const/common.const';
import { useApi } from '@/plugins/memberApi.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import type { City, Province } from '@pork-buns/core/types/common';
import { defineStore } from 'pinia';
import { ref, unref, watchEffect, type Ref } from 'vue';

export const useCommonStore = defineStore('common', () => {
  const api = useApi();
  const countries = ref<Record<CountryEnum, Province[]>>();
  const cities = ref<City[]>([]);

  function fetchProvinceList (countryID: CountryEnum = CountryEnum.China) {
    return api.get<ApiResponseData<Province[]>>('/service/API/Province/GetAsync', { params: { countryID } });
  }

  async function fetchCityList () {
    const res = await api.get<ApiResponseData<City[]>>('/service/API/Province/GetCityAsync');

    cities.value = res.data.Data;
  }

  function setCountry (countryID: CountryEnum, provinces: Province[]) {
    countries.value = Object.assign({}, countries.value, { [countryID]: provinces });
  }

  void fetchCityList();

  return {
    countries,
    cities,
    setCountry,
    fetchProvinceList,
    fetchCityList
  };
});

export function useProvinces (countryID: CountryEnum) {
  const commonStore = useCommonStore();
  const provinces = ref<Province[]>([]);

  void commonStore.fetchProvinceList(countryID).then((res) => {
    commonStore.setCountry(countryID, res.data.Data);

    provinces.value = commonStore.countries?.[countryID] ?? [];
  });

  return {
    provinces
  };
}

export function useProvince (p: Province | Ref<Province>) {
  const province = unref(p);
  const commonStore = useCommonStore();
  const cities = ref<City[]>([]);

  watchEffect(() => {
    cities.value = commonStore.cities.filter((city) => city.ProvinceID === province.ProvinceID);
  });

  return {
    province,
    cities
  };
}