<script setup lang="ts">
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { useGameStore } from '@/stores/game.store';
import { useMemberStore } from '@/stores/member.store';
import { useGameApi } from '@pork-buns/core/api/game.api';
import { useRule } from '@pork-buns/core/compositions/useRule';
import type { Wallet } from '@pork-buns/core/types/game';
import { QForm } from 'quasar';
import { reactive, ref, watchEffect } from 'vue';
import WalletPicker from '../components/WalletPicker.vue';

const memberStore = useMemberStore();
const gameStore = useGameStore();
const gameApi = useGameApi();
const $rules = useRule();
const formRef = ref<QForm>();
const canTransferAmount = ref(0);
const walletBalance = ref(0);

function submit () {
  console.log('submit');
}

const userpost = reactive<{ transferOut: Wallet, transferIn: Wallet | null, amount: number }>({
  transferOut: gameStore.mainWallet,
  transferIn: null,
  amount: 0
});

function disableTransferIn (option: Wallet) {
  return option.PlatformID === userpost.transferOut?.PlatformID;
}

function whenSetTransferOut () {
  if (userpost.transferOut.PlatformID === userpost.transferIn?.PlatformID) {
    userpost.transferIn = null;
  }
}

watchEffect(() => {
  canTransferAmount.value = 0;
  walletBalance.value = 0;

  if (userpost.transferOut) {
    if (gameStore.isMainWallet(userpost.transferOut)) {
      canTransferAmount.value = memberStore.balance;
    } else if (userpost.transferOut.PlatformID) {
      void gameApi.fetchGameAudit(userpost.transferOut.PlatformID).then((res) => {
        const audit = res.data.Data;

        canTransferAmount.value = audit.CanTranAmount;
      });
    }
  }

  if (userpost.transferIn) {
    if (gameStore.isMainWallet(userpost.transferIn)) {
      walletBalance.value = memberStore.balance;
    } else if (userpost.transferIn.PlatformID) {
      void gameApi.fetchGameAudit(userpost.transferIn.PlatformID).then((res) => {
        const audit = res.data.Data;

        walletBalance.value = audit.PlatformAmount;
      });
    }
  }
});

</script>

<template>
  <MemberContentLayout title="钱包转账">
    <q-card-section>
      <q-form ref="formRef" class="tw-max-w-[300px] tw-mx-auto" @submit="submit">
        <div class="tw-space-y-2">
          <div class="tw-space-y-2">
            <div class="tw-text-base">
              转出
            </div>
            <WalletPicker
              v-model="userpost.transferOut"
              dense
              :rules="[$rules.required()]"
              @update:model-value="whenSetTransferOut"
            >
              <template #hint>
                可转的金额：{{ $currency(canTransferAmount) }}元
              </template>
            </WalletPicker>
          </div>
          <div class="tw-space-y-2">
            <div class="tw-text-base">
              转入
            </div>
            <WalletPicker
              v-model="userpost.transferIn"
              dense
              :option-disable="disableTransferIn"
              :rules="[$rules.required()]"
            >
              <template #hint>
                该钱包的金额：{{ $currency(walletBalance) }}元
              </template>
            </WalletPicker>
          </div>
          <div class="tw-space-y-2">
            <div class="tw-text-base">
              转账金额
            </div>
            <q-input
              v-model.number="userpost.amount"
              outlined
              dense
              :rules="[
                $rules.required(),
                $rules.min(0),
                $rules.max(canTransferAmount),
                $rules.intOnly()
              ]"
            />
          </div>
          <div>
            <div class="tw-mt-8">
              <q-btn type="submit" class="tw-w-full" color="primary">
                立即转账
              </q-btn>
            </div>
          </div>
          <pre>{{ userpost }}</pre>
        </div>
      </q-form>
    </q-card-section>
  </MemberContentLayout>
</template>
