<script setup lang='ts'>
import { useGameStore } from '@/stores/game.store';
import type { Wallet } from '@pork-buns/core/types/game';
import { ref, toRef, unref, useAttrs, useSlots } from 'vue';

const props = defineProps<{
  modelValue: Wallet | null;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>();

const gameStore = useGameStore();

const attrs = useAttrs();
const slots = useSlots();
const wallets = toRef(gameStore, 'wallets');
const filteredWallets = ref<Wallet[]>([]);

function filterHandler (val: string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filteredWallets.value = unref(wallets);
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filteredWallets.value = unref(wallets).filter(row => row.ShowName.toLowerCase().indexOf(needle) > -1);
  });
}

</script>

<template>
  <q-select
    :model-value="props.modelValue"
    outlined
    :options="filteredWallets"
    option-label="ShowName"
    placeholder="请选择"
    input-debounce="0"
    use-input
    fill-input
    hide-selected
    :input-class="{ 'tw-text-primary': props.modelValue }"
    v-bind="attrs"
    @update:model-value="emits('update:modelValue', $event)"
    @filter="filterHandler"
  >
    <template v-for="(_, slotKey) in slots" #[slotKey]="slotProps">
      <slot :name="slotKey" v-bind="slotProps || {}" />
    </template>
  </q-select>
</template>