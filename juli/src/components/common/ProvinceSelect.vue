<script setup lang='ts'>
import { useProvinces } from '@/stores/common.store';
import { computed, ref, useAttrs } from 'vue';

const props = defineProps<{
  modelValue: any;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>();

// const slots = useSlots();
const attrs = useAttrs();
const { provinces } = useProvinces(0);
const provinceOptions = computed(() => provinces.value.map((row) => ({ label: row.ProvinceName, value: row.ProvinceID })));
const filteredProvinceOptions = ref<{ label: string, value: number }[]>([]);

function filterHandler (val: string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filteredProvinceOptions.value = provinceOptions.value;
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filteredProvinceOptions.value = provinceOptions.value.filter(row => row.label.toLowerCase().indexOf(needle) > -1);
  });
}
</script>

<template>
  <q-select
    :model-value="props.modelValue"
    outlined
    :options="filteredProvinceOptions"
    emit-value
    map-options
    placeholder="请选择省份"
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