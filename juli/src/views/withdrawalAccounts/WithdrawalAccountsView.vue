<script setup lang="ts">
import { MemberMenuEnum } from '@pork-buns/core/const/menu.const';
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { RouterLink } from 'vue-router';

</script>

<template>
  <MemberContentLayout title="提款帐号管理">
    <q-card-section>
      <div class="tw-flex tw-items-center tw-space-x-4">
        <div>
          <RouterLink v-slot="{ isActive, navigate }" custom :to="{ name: MemberMenuEnum.WithdrawalAccounts$BankAccounts }">
            <q-btn type="a" :outline="!isActive" color="primary" @click="navigate()">
              银行卡管理
            </q-btn>
          </RouterLink>
        </div>
        <div>
          <RouterLink v-slot="{ isActive, navigate }" custom :to="{ name: MemberMenuEnum.WithdrawalAccounts$CryptoWallets }">
            <q-btn type="a" :outline="!isActive" color="primary" @click="navigate()">
              电子钱包管理
            </q-btn>
          </RouterLink>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="tw-pt-0">
      <router-view />
    </q-card-section>
  </MemberContentLayout>
</template>
