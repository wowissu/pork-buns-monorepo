import { useWithdrawalAccountApi } from '@pork-buns/core/api/member.api';
import type { BankAcount } from '@pork-buns/core/types/bank';
import { ContractEnum, type CryptoWallet, type SmartContractOption } from '@pork-buns/core/types/crypto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 提款帳號分為兩類
 *
 * 銀行帳號 - withdrawalBank
 * 加密錢包 - withdrawalCrypto
 */

export const useWithdrawalBankStore = defineStore('withdrawlBank', () => {
  const bankAccountList = ref<BankAcount[]>([]);
  const withdrawalAccountApi = useWithdrawalAccountApi();

  async function fetchBankAccountList () {
    const res = await withdrawalAccountApi.fetchBankAccountList();

    bankAccountList.value = res.data.Data;

    return res;
  }

  return {
    bankAccountList,
    fetchBankAccountList,
    addBankAccount: withdrawalAccountApi.addBankAccount,
    verifyBeforeAddBankAccount: withdrawalAccountApi.verifyBeforeAddBankAccount
  };
});

export const useWithdrawalCryptoStore = defineStore('withdrawalCrypto', () => {
  const withdrawalAccountApi = useWithdrawalAccountApi();
  const cryptoWalletList = ref<CryptoWallet[]>([]);
  const cryptoContractOptions: SmartContractOption[] = [
    // {
    //   label: "USDT(ERC20)",
    //   value: "ERC20"
    // },
    {
      label: 'USDT(TRC20)',
      value: ContractEnum.TRC20
    }
  ];

  async function fetchCryptoWalletList () {
    const res = await withdrawalAccountApi.fetchCryptoWalletList();

    cryptoWalletList.value = res.data.Data;

    return res;
  }

  return {
    cryptoWalletList,
    cryptoContractOptions,
    fetchCryptoWalletList,
    addCryptoWallet: withdrawalAccountApi.addCryptoWallet,
    verifyBeforeAddCryptoWallet: withdrawalAccountApi.verifyBeforeAddCryptoWallet
  };
});