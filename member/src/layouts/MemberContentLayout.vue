<script setup lang="ts">

import iconTitle from '@/assets/member/icon_title.png';

const props = defineProps<{
  title: string
}>();

</script>

<template>
  <slot name="title">
    <q-card-section class="tw-py-0">
      <div class="tw-flex tw-items-center tw-space-x-2 tw-w-full">
        <q-icon :name="`img:${iconTitle}`" size="sm" />
        <div class="tw-flex-1 tw-border-b tw-border-b-primary tw-py-1 tw-text-primary tw-text-lg tw-font-bold">
          <span>{{ props.title }}</span>
        </div>
      </div>
    </q-card-section>
  </slot>
  <slot name="default" />
</template>