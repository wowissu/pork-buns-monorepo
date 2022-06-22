<script setup lang='ts'>
import { useCommonStore } from '@/stores/common.store';
import type { City } from '@/types/common';
import { computed, ref, unref, useAttrs } from 'vue';

const props = defineProps<{
  modelValue: any;
  provinceId?: number;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>();

// const slots = useSlots();
const attrs = useAttrs();
const common = useCommonStore();
const cities = computed(() => common.cities.filter(row => row.ProvinceID === props.provinceId));
const filteredCities = ref<City[]>([]);

function filterHandler (val: string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filteredCities.value = unref(cities);
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filteredCities.value = unref(cities).filter(row => row.CityName.toLowerCase().indexOf(needle) > -1);
  });
}
</script>

<template>
  <q-select
    :model-value="props.modelValue"
    outlined
    :options="filteredCities"
    emit-value
    map-options
    option-label="CityName"
    option-value="CityID"
    placeholder="请选择城市"
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