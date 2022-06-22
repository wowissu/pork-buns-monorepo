<script setup lang="ts">
import WithdrawalAccountCard from '@/components/withdrawalAccount/WithdrawalAccountCard.vue';
import WithdrawalAccountAddCard from '@/components/withdrawalAccount/WithdrawalAccountAddCard.vue';
import { defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useCryptoStore } from '@/stores/crypto.store';

const $q = useQuasar();
const cryptoStore = useCryptoStore();

void cryptoStore.fetchCryptoWalletList();

function showAddCardModal () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/withdrawalAccount/AddCryptoWalletModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  }).onOk(() => {
    void cryptoStore.fetchCryptoWalletList();
  });
}

</script>

<template>
  <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-4">
    <WithdrawalAccountCard
      v-for="(wallet, i) in cryptoStore.cryptoWalletList"
      :key="i"
      :bank-name="wallet.UsdtType"
      :account-number="wallet.UsdtAddress"
      account-name="..."
    />
    <WithdrawalAccountAddCard title="添加电子钱包" @add="showAddCardModal" />
  </div>
</template>
