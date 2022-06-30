<script setup lang="ts">
import WithdrawalAccountCard from '@/components/withdrawalAccount/WithdrawalAccountCard.vue';
import WithdrawalAccountAddCard from '@/components/withdrawalAccount/WithdrawalAccountAddCard.vue';
import { useWithdrawalBankStore } from '@/stores/withdrawalAccount.store';
import { defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useCommonStore } from '@/stores/common.store';

const $q = useQuasar();
const bankStore = useWithdrawalBankStore();
const commonStore = useCommonStore();

void bankStore.fetchBankAccountList();

function showAddCardModal () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/withdrawalAccount/AddBankAccountModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  }).onOk(() => {
    void bankStore.fetchBankAccountList();
  });
}

function getBankNameById (bankId: number) {
  return commonStore.bankIdMap[bankId]?.BankName ?? '';
}

</script>

<template>
  <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-4">
    <WithdrawalAccountCard
      v-for="(account, i) in bankStore.bankAccountList"
      :key="i"
      :bank-name="getBankNameById(account.BankID)"
      :account-name="account.AccountName"
      :account-number="account.BankAccount"
    />
    <WithdrawalAccountAddCard title="添加银行卡" @add="showAddCardModal" />
  </div>
</template>
