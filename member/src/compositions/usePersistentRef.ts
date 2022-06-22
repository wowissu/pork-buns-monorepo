import { customRef } from 'vue';

interface Persisten<T> {
  key: string,
  value: T | undefined
}

export function usePersistenRef<T extends { toString: () => string }> (key: string, val?: T) {
  const persistenKey = `presisten_$_${key}`;

  const  myRef = customRef<T | undefined>((track, trigger) => ({
    get: () => {
      track();

      return (JSON.parse(localStorage.getItem(persistenKey) ?? '') as Persisten<T>).value;
    },
    set: (v: T | undefined) => {
      localStorage.setItem(persistenKey, JSON.stringify({ key, value: v }));

      trigger();
    }
  }));

  if (localStorage.getItem(persistenKey) === null) {
    myRef.value = val;
  }

  return myRef;
}