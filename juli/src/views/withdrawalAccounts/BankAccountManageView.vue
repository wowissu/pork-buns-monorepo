<script setup lang="ts">
import WithdrawalAccountCard from '@/components/withdrawalAccount/WithdrawalAccountCard.vue';
import WithdrawalAccountAddCard from '@/components/withdrawalAccount/WithdrawalAccountAddCard.vue';
import { useWithdrawalStore } from '@/stores/withdrawal.store';
import { useBankStore } from '@/stores/bank.store';
import { defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const bankStore = useBankStore();
const withdrawalStore = useWithdrawalStore();

void withdrawalStore.fetchBankAccountList();

function showAddCardModal () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/withdrawalAccount/AddBankAccountModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  }).onOk(() => {
    void withdrawalStore.fetchBankAccountList();
  });
}

</script>

<template>
  <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-4">
    <WithdrawalAccountCard
      v-for="(account, i) in withdrawalStore.bankAccountList"
      :key="i"
      :bank-name="bankStore.bankIdMap[account.BankID]?.BankName ?? ''"
      :account-name="account.AccountName"
      :account-number="account.BankAccount"
    />
    <WithdrawalAccountAddCard title="添加银行卡" @add="showAddCardModal" />
  </div>
</template>
