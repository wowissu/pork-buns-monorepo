import type { ApiResponseData } from '../types/api';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import { CountryEnum } from '../const/common.const';
import type { City, Province } from '../types/common';
import type { Bank } from '../types/bank';

export const useCommonApi = defineStore('commonApi', () => {
  const api = useApi();

  return {
    fetchProvinces: (countryID: CountryEnum = CountryEnum.China) => api.get<ApiResponseData<Province[]>>('/service/API/Province/GetAsync', { params: { countryID } }),
    fetchCities: () => api.get<ApiResponseData<City[]>>('/service/API/Province/GetCityAsync'),
    fetchBanks: (source = 2) => api.get<ApiResponseData<Bank[]>>('service/API/Bank/ListAsync', { params: { source } })
  };
});
