<script setup lang="ts">
import { useMemberStore } from '@/stores/member.store';
import { computed, reactive, type Ref } from 'vue';

const memberStore = useMemberStore();
const noName = computed(() => !memberStore.member?.Name);
const noBankcard = computed(() => memberStore.member?.MemberBank !== 1);
const noPhone = computed(() => memberStore.member?.CellPhoneStatus !== 1);
const noEmail = computed(() => memberStore.member?.EmailStatus !== 1);

const percentage = computed(() => memberStore.member?.Percentage ?? 0);

const securityText = computed(() => {
  switch (true) {
    case percentage.value <= 25:
      return '弱';
    case percentage.value <= 75:
      return '中';
    case percentage.value <= 100:
      return '強';
    default:
      return '無法偵測';
  }
});

function condition<T> (r: Ref<boolean>, a: T, b: T) {
  return computed<T>(() => r.value ? a : b);
}

const list = reactive([
  {
    color: condition(noName, 'warning', 'transparent'),
    textColor: condition(noName, 'white', 'primary'),
    icon: condition(noName, 'mdi-account', 'mdi-account-check')
  },
  {
    color: condition(noBankcard, 'warning', 'transparent'),
    textColor: condition(noBankcard, 'white', 'primary'),
    icon: condition(noBankcard, 'mdi-credit-card', 'mdi-credit-card-check')
  },
  {
    color: condition(noPhone, 'warning', 'transparent'),
    textColor: condition(noPhone, 'white', 'primary'),
    icon: condition(noPhone, 'mdi-cellphone', 'mdi-cellphone-check')
  },
  {
    color: condition(noEmail, 'warning', 'transparent'),
    textColor: condition(noEmail, 'white', 'primary'),
    icon: condition(noEmail, 'mdi-email', 'mdi-email-check')
  }
]);

</script>

<template>
  <div class="tw-space-y-4">
    <div>
      <div class="tw-flex tw-items-end">
        账号安全等级：<span class="tw-text-lg">{{ securityText }}</span>
      </div>
      <div v-if="percentage < 100" class="tw-text-xs">
        您的账号存在安全隐患，有待加强哦
      </div>
    </div>
    <div class="tw-flex tw-justify-between tw-items-center">
      <q-avatar
        v-for="(row, i) in list"
        :key="i"
        size="lg"
        :color="row.color"
        :text-color="row.textColor"
        :icon="row.icon"
      />
    </div>
  </div>
</template>
