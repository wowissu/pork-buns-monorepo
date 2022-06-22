import { ContractEnum } from '@/const/crypto.const';
import { useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@/types/api';
import type { SmartContractOption, CryptoWallet } from '@/types/crypto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCryptoStore = defineStore('crypto', () => {
  const api = useApi();
  const cryptoWalletList = ref<CryptoWallet[]>([]);
  const cryptoContractOptions = ref<SmartContractOption[]>([
    // {
    //   label: "USDT(ERC20)",
    //   value: "ERC20"
    // },
    {
      label: 'USDT(TRC20)',
      value: ContractEnum.TRC20
    }
  ]);

  async function fetchCryptoWalletList () {
    const res = await api.post<ApiResponseData<CryptoWallet[]>>('service/API/MemberWithdrawUsdt/ListAsync');

    cryptoWalletList.value = res.data.Data;

    return res;
  }

  async function verifyBeforeAddCryptoWallet (password: string, bankPassword: string) {
    const res = await api.post('service/API/MemberWithdrawUsdt/AddValidateAsync', {
      Password: password,
      BankPassword: bankPassword
    });

    return res;
  }

  async function addCryptoWallet (password: string, bankPassword: string, usdtType: ContractEnum, usdtAddress: string) {
    const res = await api.post('service/API/MemberWithdrawUsdt/AddAsync', {
      Password: password,
      BankPassword: bankPassword,
      UsdtType: usdtType,
      Address: usdtAddress
    });

    return res;
  }

  return {
    cryptoWalletList,
    cryptoContractOptions,
    fetchCryptoWalletList,
    addCryptoWallet,
    verifyBeforeAddCryptoWallet
  };
});
