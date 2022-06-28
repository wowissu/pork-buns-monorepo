<script setup lang="ts">

import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { ref } from 'vue';
import { TransactionDateTypeEnum, TransactionTypeEnum } from '@pork-buns/core/types/transactionRecord';
import { transactionDateTypeList } from '@/const/transaction.const';
import { useRoute, useRouter } from 'vue-router';
import { MemberMenuEnum } from '@/const/menu.const';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const $i18n = useI18n();
const dayType = ref<TransactionDateTypeEnum>(route.params.dayType as TransactionDateTypeEnum);
const transactionType = ref<TransactionTypeEnum>(route.name as TransactionTypeEnum);

console.log(route);

const routeOptions = [
  {
    label: $i18n.t('common.TransactionTypeEnum.Deposit'),
    value: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Deposit}`
  },
  {
    label: $i18n.t('common.TransactionTypeEnum.Withdrawals'),
    value: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Withdrawals}`
  },
  {
    label: $i18n.t('common.TransactionTypeEnum.Transfer'),
    value: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Transfer}`
  },
  {
    label: $i18n.t('common.TransactionTypeEnum.Preferential'),
    value: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Preferential}`
  },
  {
    label: $i18n.t('common.TransactionTypeEnum.Others'),
    value: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Others}`
  }
];

function searchSubmit () {
  void router.push({ name: transactionType.value, params: { dayType: dayType.value } });
}

</script>

<template>
  <MemberContentLayout title="交易记录">
    <q-card flat>
      <q-card-section>
        <q-form @submit="searchSubmit">
          <div class="tw-flex tw-py-4 tw-space-x-4 tw-items-center">
            <q-select
              v-model="transactionType"
              class="tw-min-w-[200px]"
              outlined
              dense
              :options="routeOptions"
              map-options
              emit-value
              option-label="label"
              option-value="value"
            />
            <q-select
              v-model="dayType"
              placeholder="全部游戏"
              class="tw-min-w-[200px]"
              outlined
              dense
              :options="transactionDateTypeList"
              :option-label="val => $t(`common.TransactionDateTypeEnum.${val}`)"
            />
            <div>
              <q-btn type="submit" color="primary" label="查询" size="md" />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <router-view />
      </q-card-section>
    </q-card>
  </MemberContentLayout>
</template>
