<script setup lang="ts">
import { useMemberStore } from '@/stores/member.store';
import dayjs from 'dayjs';
import { computed } from 'vue';

const memberStore = useMemberStore();

const joinDays = computed(() => dayjs().diff(memberStore.member?.CreateDate, 'd'));

</script>

<template>
  <div class="tw-space-y-2">
    <div class="tw-flex tw-items-end tw-space-x-2">
      <span>欢迎您，</span>
      <span class="tw-text-2xl tw-leading-6 tw-tracking-normal">{{ memberStore.member?.Account }}</span>
      <span>|</span>
      <span>VIP {{ memberStore.member?.VIPLevel }}</span>
    </div>
    <div>
      已加入大家庭 {{ joinDays }} 天
    </div>
    <div>
      上次登陆时间 {{ $date(memberStore.member?.LastLoginDate) }}
    </div>
  </div>
</template>
