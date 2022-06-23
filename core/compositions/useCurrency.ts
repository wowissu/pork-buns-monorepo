import numeral from 'numeral';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export function $currency (val: string | number) {
  return numeral(val).format('0,0[.]00');
}

export function useCurrency (val: Ref<number> | number): [ currency: ComputedRef<string>, ref: Ref<number> ] {
  const num = ref(val);
  const currency = computed(() => $currency(num.value));

  return [currency, num];
}