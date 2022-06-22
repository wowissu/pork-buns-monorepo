<script setup lang="ts">
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { useMemberStore } from '@/stores/member.store';
import { useVIPStore, isVIPColumn } from '@/stores/vip.store';
import { storeToRefs } from 'pinia';
import { VIPColumnEnum } from '@pork-buns/core/types/vip';
import { computed, reactive, ref, watchEffect } from 'vue';
import type { QTableColumn } from 'quasar';
import { useI18n } from 'vue-i18n';

interface VIPRow {
  column: VIPColumnEnum
  [level: string]: string | number
}

const i18n = useI18n();
const vipStore = useVIPStore();
const memberStore = useMemberStore();
const { vip } = storeToRefs(memberStore);
const nextLevel = computed(() => vipStore.levels.find(l => l.LevelID === vip.value?.NextLevel));

const vipColumns = computed<QTableColumn<VIPRow>[]>(() => [
  { name: 'level', align: 'left', label: '等级', field: 'column', format: (val) => i18n.t(`vip.columns.${String(val)}`) },
  ...vipStore.levels.map((level) => {
    const isMyLevel = level.LevelID === memberStore.member?.VIPLevel;

    return {
      name: `vip_${level.LevelID}`,
      align: 'center',
      label: `VIP ${level.LevelID}`,
      field: level.LevelID,
      classes: isMyLevel && 'my-level',
      headerClasses: isMyLevel && 'my-level'
    } as QTableColumn<VIPRow>;
  })
]);
const vipRows = ref<VIPRow[]>([
  { column: VIPColumnEnum.BirthdayGift },
  { column: VIPColumnEnum.UpgradeGift },
  { column: VIPColumnEnum.Sport },
  { column: VIPColumnEnum.Live },
  { column: VIPColumnEnum.ESport },
  { column: VIPColumnEnum.Lottery },
  { column: VIPColumnEnum.Games },
  { column: VIPColumnEnum.Chess },
  { column: VIPColumnEnum.Fish },
  { column: VIPColumnEnum.TotalDeposit },
  { column: VIPColumnEnum.TotalBet },
  { column: VIPColumnEnum.DemoteTotalDeposit }
]);

watchEffect(() => {
  vipRows.value = [...vipStore.privileges, ...vipStore.levels].reduce((acc, p) => {
    Object.entries(p).forEach(([pKey, pVal]) => {
      if (!isVIPColumn(pKey)) {
        return;
      }

      acc.find(row => row.column === pKey)![p.LevelID] = pVal;
    });

    return acc;
  }, vipRows.value);
});

// watch(() => vipRows, (val) => {
//   triggerRef(vipRows);
// }, { immediate: true, deep: true });

const depositProgress = ref(0);
const betProgress = ref(0);
const keepLevelDepositProgress = ref(0);

const levelUpRequirements = reactive([
  {
    title: '存款升级',
    total: computed(() => nextLevel.value?.TotalDeposit ?? 0),
    value: computed(() => (nextLevel.value?.TotalDeposit ?? 0) - (vip.value?.GapDeposit ?? 0))
  },
  {
    title: '投注升级',
    total: computed(() => nextLevel.value?.TotalDeposit ?? 0),
    value: computed(() => (nextLevel.value?.TotalDeposit ?? 0) - (vip.value?.GapGameTotalBet ?? 0))
  },
  {
    title: '保级存款',
    total: computed(() => nextLevel.value?.DemoteTotalDeposit ?? 0),
    value: computed(() => (nextLevel.value?.DemoteTotalDeposit ?? 0) - (vip.value?.KeepGapDeposit ?? 0))
  }
]);

watchEffect(() => {
  depositProgress.value = 0;
  betProgress.value = 0;

  if (!vip.value) {
    return;
  }

  if (nextLevel.value) {
    const total = nextLevel.value?.TotalDeposit;
    const gap = vip.value?.GapDeposit ?? total;

    if (total !== undefined) {
      depositProgress.value = (total - gap) / total;
    }
  }

  if (nextLevel.value) {
    const total = nextLevel.value?.TotalBet;
    const gap = vip.value?.GapGameTotalBet ?? total;

    if (total !== undefined) {
      betProgress.value = (total - gap) / total;
    }
  }

  if (nextLevel.value) {
    const total = nextLevel.value?.DemoteTotalDeposit;
    const gap = vip.value?.KeepGapDeposit ?? total;

    if (total !== undefined) {
      keepLevelDepositProgress.value = (total - gap) / total;
    }
  }
});

</script>

<template>
  <MemberContentLayout v-if="vip && nextLevel" title="我的VIP特权">
    <q-card-section class="tw-font-medium">
      <div>
        <div>
          我的VIP等级： <span class="tw-text-primary tw-font-bold">{{ vip.NowLevelEName }}</span>
        </div>
        <div>
          <div class="tw-space-x-4">
            <!-- <q-tooltip>我享有的特权</q-tooltip> -->
            <q-badge color="positive" :outline="!(vip.NowLevel >= 0)">
              提款时间
            </q-badge>
            <q-badge color="positive" :outline="!(vip.NowLevel >= 0)">
              日提款次数
            </q-badge>
            <q-badge color="grey" :outline="!(vip.NowLevel >= 1)">
              升级礼金
            </q-badge>
            <q-badge color="grey" :outline="!(vip.NowLevel >= 1)">
              生日礼金
            </q-badge>
            <q-badge color="grey" :outline="!(vip.NowLevel >= 1)">
              日额外返水
            </q-badge>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tw-flex tw-items-center tw-space-x-4">
        <q-card v-for="row in levelUpRequirements" :key="row.title" class="tw-flex-1">
          <q-card-section class="tw-flex tw-flex-col tw-items-center tw-space-y-2">
            <div>
              {{ row.title }}
            </div>
            <div class="tw-font-bold tw-text-lg tw-flex tw-items-baseline tw-space-x-1" :class="{ 'tw-text-primary': depositProgress >= 1, 'tw-text-negative': depositProgress < 1 }">
              <div>
                {{ $currency(row.value) }}
              </div>
              <div class="tw-text-gray-400 tw-text-xs">
                /{{ $currency(row.total) }}
              </div>
            </div>
          </q-card-section>
          <q-linear-progress v-if="row.total > 0" :value="row.value / row.total" rounded color="primary" />
        </q-card>
      </div>
    </q-card-section>

    <q-card-section>
      <q-table
        class="vip-level-table"
        flat
        bordered
        :rows="vipRows"
        :columns="(vipColumns as any[])"
        :rows-per-page-options="[0]"
        row-key="column"
        hide-pagination
        table-class="tw-font-medium"
      />
    </q-card-section>
  </MemberContentLayout>
</template>

<style lang="scss">
.vip-level-table {
  .my-level {
    @apply tw-bg-primary/10 tw-text-primary tw-font-bold;
  }
}
</style>