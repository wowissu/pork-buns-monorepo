<script setup lang="ts">

const props = defineProps<{
  bankName: string;
  accountNumber: string;
  accountName?: string;
}>();

</script>

<template>
  <q-responsive :ratio="400/225">
    <div class="withdrawal-account-card tw-rounded-4 tw-p-4 tw-rounded-md tw-overflow-hidden">
      <div class="tw-h-full tw-flex tw-flex-col tw-justify-between tw-text-white tw-font-medium">
        <div class="tw-self-start">
          <span class="tw-text-lg">{{ props.bankName }}</span>
        </div>
        <div class="tw-self-center">
          <span class="tw-text-2xl sm:tw-text-3xl lg:tw-text-2xl tw-tracking-widest">{{ props.accountNumber }}</span>
        </div>
        <div class="tw-self-end">
          <span class="tw-text-base">{{ props.accountName }}</span>
        </div>
      </div>
    </div>
  </q-responsive>
</template>

<style scoped>
.withdrawal-account-card {
  background-image: url("@/assets/member/account_card.png");
  background-size: cover;
}
</style>
