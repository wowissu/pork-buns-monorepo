<script setup lang="ts">
const props = defineProps<{
  title: string
}>();

const emits = defineEmits<{
  (e: 'add'): void
}>();

</script>

<template>
  <q-responsive :ratio="400/225">
    <div class="withdrawal-account-add-card tw-rounded-md tw-border-2 tw-border-primary/70 tw-flex tw-items-center tw-justify-center">
      <q-btn icon="mdi-plus" flat class="tw-text-lg tw-text-primary/70" @click="emits('add')">
        {{ props.title }}
      </q-btn>
    </div>
  </q-responsive>
</template>
