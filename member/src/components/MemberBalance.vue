<script setup lang="ts">
import { useMemberStore, $balanceLoading } from '@/stores/member.store';

const memberStore = useMemberStore();

</script>

<template>
  <div class="tw-flex tw-flex-col">
    <div class="tw-flex tw-items-center tw-space-x-2">
      <div>
        中心钱包金额
      </div>
      <div>
        <q-btn icon="mdi-refresh" flat round size="sm" :loading="$balanceLoading.loading" @click="memberStore.fetchBalance" />
      </div>
      <!-- <q-icon name="mdi-refresh-circle" /> -->
    </div>
    <div class="tw-text-5xl tw-font-bold">
      {{ $currency(memberStore.balance) }} <span class="tw-text-sm">CNY</span>
    </div>
  </div>
</template>
