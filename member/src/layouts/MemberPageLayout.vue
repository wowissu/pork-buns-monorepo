<script setup lang="ts">
import MemberWelcome from '@/components/MemberWelcome.vue';
import MemberBalance from '@/components/MemberBalance.vue';
import MemberWalletList from '@/components/MemberWalletList.vue';
import AccountSecuritySign from '@/components/AccountSecuritySign.vue';
import { useMemberStore } from '@/stores/member.store';
import { useAppStore } from '@/stores/app.store';
import { defineAsyncComponent } from 'vue';
import { usePersistenRef } from '@/compositions/usePersistentRef';

const MemberNavSide = defineAsyncComponent(() => import('@/components/MemberNavSide.vue'));

const memberStore = useMemberStore();
const appStore = useAppStore();

void memberStore.fetchInfo();
void memberStore.fetchBalance();

const visible = usePersistenRef('visible', false);

</script>

<template>
  <q-page class="member-page-layout tw-pb-40">
    <div class="tw-container tw-mx-auto tw-p-2">
      <div class="tw-flex tw-justify-between tw-items-center tw-px-4">
        <div>
          <MemberWelcome />
        </div>
        <div>
          <MemberBalance />
        </div>
        <div>
          <div class="tw-flex tw-flex-col tw-space-y-2">
            <q-btn type="a" class="tw-bg-gradient-to-r tw-from-[#dc8c01] tw-to-[#ffb400]" text-color="white" :href="appStore.agentUrl" target="_blank">
              申请加入代理
            </q-btn>
            <q-btn color="primary" @click="visible = !visible">
              查看其它钱包余额
            </q-btn>
          </div>
        </div>
        <div>
          <AccountSecuritySign />
        </div>
      </div>
    </div>

    <q-slide-transition>
      <div v-show="visible" class="tw-container tw-mx-auto">
        <div class="tw-p-2">
          <MemberWalletList />
        </div>
      </div>
    </q-slide-transition>

    <!-- main content -->
    <template v-if="memberStore.member">
      <div class="tw-container tw-mx-auto tw-p-2 tw-mt-10">
        <q-card flat>
          <q-card-section horizontal class="tw-p-4">
            <template v-if="$q.screen.gt.sm">
              <q-card-section>
                <MemberNavSide />
              </q-card-section>
              <q-separator vertical color="primary" />
            </template>
            <q-card-section class="tw-w-full tw-p-0 sm:tw-px-4">
              <router-view />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<style >
.member-page-layout {
  background: url(@/assets/member/bg_all.png) repeat;
}
</style>