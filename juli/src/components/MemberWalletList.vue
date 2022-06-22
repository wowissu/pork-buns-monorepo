<script setup lang="ts">
import { useMemberStore } from '@/stores/member.store';
import { useGameStore, $allBalanceLoading } from '@/stores/game.store';
import { toRef } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const loading = toRef($allBalanceLoading, 'loading');

const memberStore = useMemberStore();
const gameStore = useGameStore();

// console.log($q.screen.sizes);

function takeAllMoneyBack () {
  return $q.dialog({
    title: '回收钱包',
    message: '是否要一键回收其它钱包金额？',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void memberStore.takeAllMoneyBack();
  });
}

</script>

<template>
  <q-card flat>
    <q-card-section>
      <div class="tw-flex tw-space-x-4">
        <div class="tw-flex-1 ">
          <q-scroll-area style="height: 110px;" class="tw-pr-4" visible>
            <div class="tw-grid tw-grid-cols-4 tw-gap-2 tw-w-full">
              <div class="tw-border tw-rounded-lg tw-overflow-hidden">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label>中心钱包</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <span class="tw-font-bold tw-text-primary">{{ $currency(memberStore.balance) }}</span>
                  </q-item-section>
                </q-item>
              </div>
              <div v-for="(game, i) in gameStore.games" :key="i" class="tw-border tw-rounded-lg tw-overflow-hidden">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label>{{ game.ShowName || game.PlatformEName }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <template v-if="loading">
                      <q-spinner
                        color="primary"
                        size="xs"
                        :thickness="2"
                      />
                    </template>
                    <template v-else>
                      <span class="tw-font-bold tw-text-primary">{{ $currency(0) }}</span>
                    </template>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-scroll-area>
        </div>
        <div>
          <q-btn color="primary" @click="takeAllMoneyBack()">
            回收钱包
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <!-- <div class="tw-bg-white/70 tw-rounded-lg tw-py-4 tw-px-6 tw-shadow tw-shadow-gray-300" /> -->
</template>
