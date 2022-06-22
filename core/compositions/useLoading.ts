import { computed, readonly, ref } from 'vue';

export function useLoading (startAt = 0) {
  const stacking = ref(startAt);

  const loading = computed(() => {
    return stacking.value ? (stacking.value > 0) : false;
  });

  function clear () {
    stacking.value = 0;
  }

  function increase () {
    stacking.value += 1;
  }

  function decrease () {
    stacking.value = Math.max(0, stacking.value - 1);
  }

  function start () {
    increase();
  }

  function done (delay: number): Promise<void>;
  function done (): void;
  function done (delay?: number) {
    return delay === undefined ? decrease() : new Promise<void>(resolve => setTimeout(() => (decrease(), resolve()), delay));
  }

  return readonly({ loading, clear, increase, decrease, start, done }) ;
}