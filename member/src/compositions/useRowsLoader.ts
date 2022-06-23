import { computed, readonly, ref, toRefs, type DeepReadonly, type Ref, type UnwrapNestedRefs } from 'vue';

type DataPaginationContext<T> = DeepReadonly<UnwrapNestedRefs<{
  rows: Ref<T[]>,
  pageIndex: Ref<number>,
  pageSize: Ref<number>,
  totalRows: Ref<number>,
  pageCount: Ref<number>,
  nextIndex: Ref<number>,
  setSize: (val: number) => void
  setIndex: (val: number) => void
  setMinIndex: (val: number) => void
  setTotal: (val: number) => void
  setData: (rows: T[], startIndex?: number) => void
  clearData: () => void
}>>;

export function useRowsLoader<T, A extends any[]> (defaultValue: T[] = [], cb: (ctx: DataPaginationContext<T>) => ((...args: A) => Promise<T[]>)) {
  const rows = ref<T[]>(defaultValue) as Ref<T[]>;
  const totalRows = ref(0);
  const pageIndex = ref(0);
  const pageSize = ref(20);
  const minIndex = ref(0);
  const pageCount = computed(() => Math.ceil(totalRows.value / pageSize.value));
  const nextIndex = computed(() => pageIndex.value + 1);

  const setSize = (val: number) => {
    pageSize.value = val;
  };
  const setIndex = (val: number) => {
    pageIndex.value = val;
  };
  const setMinIndex = (val: number) => {
    minIndex.value = val;
  };
  const setTotal = (val: number) => {
    totalRows.value = val;
  };
  const setData = (data: T[], startIndex = ((pageIndex.value - 1) * pageSize.value)) => {
    rows.value.splice(startIndex, data.length, ...data);
  };
  const clearData = () => {
    rows.value = [];
  };

  const ctx = readonly({
    rows,
    pageIndex,
    pageSize,
    totalRows,
    pageCount,
    nextIndex,
    setSize,
    setIndex,
    setTotal,
    setData,
    setMinIndex,
    clearData
  });

  const cbFn = cb(ctx);

  // load current page
  const load = async function (...args: A) {
    return cbFn(...args);
  };

  //
  const loadMore = function (...args: A) {
    if (pageIndex.value >= pageCount.value) {
      return;
    }

    setIndex(Math.min(pageIndex.value + 1, pageCount.value));

    return load(...args);
  };

  const reload = function (...args: A) {
    clearData();
    setIndex(minIndex.value);

    return load(...args);
  };

  return readonly({
    ...toRefs(ctx),
    load,
    loadMore,
    reload
  });
}