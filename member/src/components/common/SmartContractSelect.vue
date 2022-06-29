useWithdrawalCryptoStore<script setup lang='ts'>
import { useWithdrawalCryptoStore } from '@/stores/withdrawalAccount.store';
import { useAttrs } from 'vue';

const props = defineProps<{
  modelValue: any;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>();

// const slots = useSlots();
const attrs = useAttrs();
const cryptoStore = useWithdrawalCryptoStore();

</script>

<template>
  <q-select
    :model-value="props.modelValue"
    outlined
    :options="cryptoStore.cryptoContractOptions"
    emit-value
    map-options
    option-label="label"
    option-value="value"
    placeholder="请选择智能合约"
    clearable
    v-bind="attrs"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <!-- <template v-for="(slot, slotKey) in slots" #[slotKey]="slotProps">
      <slot :name="slot" v-bind="slotProps" />
    </template> -->
  </q-select>
</template>