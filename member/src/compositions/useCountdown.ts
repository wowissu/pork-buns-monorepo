import { computed, readonly, ref } from 'vue';

/** 倒數計量器 */
export function useCountdown (interval = 1000) {
  const intervalNumber = ref(0);
  const defaultCount = ref(0);
  const count = ref(0);
  const isCounting = computed(() => intervalNumber.value === 0);

  function set (num: number) {
    count.value = num;
  }

  function reset () {
    count.value = defaultCount.value;
  }

  function setDefault (num: number) {
    defaultCount.value = num;
  }

  function start (num: number = defaultCount.value) {
    stop();
    set(num);
    setDefault(num);

    return new Promise<void>((resolve) => {
      (intervalNumber.value = setInterval(() => {
        count.value = count.value > 0 ? count.value - 1 : (stop(), resolve(), 0);
      }, interval));
    });
  }

  function restart (num = defaultCount.value) {
    stop();
    reset();

    return start(num);
  }

  function stop () {
    clearInterval(intervalNumber.value);

    const stopCount = count.value;

    return () => start(stopCount);
  }

  return readonly({
    isCounting,
    count: readonly(count),
    stop,
    start,
    restart,
    set,
    reset,
    setDefault
  });
}