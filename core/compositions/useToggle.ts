import { computed, readonly, ref, unref, type Ref } from 'vue';

export function useToggle <T, F = T> (initValue: boolean | Ref<boolean>, trueResult: T, falseResult: F) {
  const status = ref(initValue);
  const value = computed(() => unref(status) ? trueResult : falseResult);

  const toggle = function toggle () {
    status.value = !status.value;
  };

  return readonly({
    value,
    toggle,
    status
  });
}