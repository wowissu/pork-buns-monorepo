<script setup lang='ts'>
import { useBankStore } from '@/stores/bank.store';
import type { Bank } from '@pork-buns/core/types/bank';
import { ref, toRef, unref, useAttrs } from 'vue';

const props = defineProps<{
  modelValue: any;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>();

// const slots = useSlots();
const attrs = useAttrs();
const bankStore = useBankStore();
const bankList = toRef(bankStore, 'bankList');
const filteredBankList = ref<Bank[]>([]);

function filterHandler (val: string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filteredBankList.value = unref(bankList);
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filteredBankList.value = unref(bankList).filter(row => (
      (row.BankName?.toLowerCase().indexOf(needle) ?? -1) > -1 ||
      (row.BankEName?.toLowerCase().indexOf(needle) ?? -1) > -1
    ));
  });
}
</script>

<template>
  <q-select
    :model-value="props.modelValue"
    outlined
    :options="filteredBankList"
    emit-value
    map-options
    :option-label="row => row.BankName || row.BankEName"
    option-value="BankID"
    placeholder="请选择银行"
    input-debounce="0"
    use-input
    fill-input
    hide-selected
    clearable
    v-bind="attrs"
    @update:model-value="emits('update:modelValue', $event)"
    @filter="filterHandler"
  >
    <!-- <template v-for="(slot, slotKey) in slots" #[slotKey]="slotProps">
      <slot :name="slot" v-bind="slotProps" />
    </template> -->
  </q-select>
</template>