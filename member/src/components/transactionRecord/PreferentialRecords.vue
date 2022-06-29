<script setup lang="ts">

import { useRecordApi } from '@pork-buns/core/api/record.api';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import type { QTableColumn, QTableProps } from 'quasar';
import { TransactionDateTypeEnum, TransactionTypeEnum, type PreferentialRecord } from '@pork-buns/core/types/transactionRecord';
import { useRowsLoader } from '@/compositions/useRowsLoader';
import { $date } from '@pork-buns/core/compositions/useDate';
import { watch } from 'vue';

const recordApi = useRecordApi();
const pagination = { rowsPerPage: 0 };
const $loading = useLoading();
const props = defineProps<{
  dayType: TransactionDateTypeEnum
}>();

const columns: QTableColumn<PreferentialRecord>[] = [
  { name: 'createDate', label: '领取时间', align: 'left', field: 'CreateDate', format: (val: string) => $date(val) },
  { name: 'amount', label: '优惠金额', field: 'ChangePoint' },
  { name: 'type', label: '活动名称', field: 'PreferentialTypeEName' },
  { name: 'note', label: '备注', field: 'PreferentialNote' }
];

const $recordLoader = useRowsLoader([] as PreferentialRecord[], (ctx) => {
  ctx.setSize(20);
  ctx.setIndex(1);
  ctx.setMinIndex(1);

  return async () => {
    try {
      $loading.start();

      const res = await recordApi.fetchRecord({
        DayType: props.dayType,
        TransactionType: TransactionTypeEnum.Preferential,
        Pagination: {
          PageIndex: ctx.pageIndex,
          PageSize: ctx.pageSize
        }
      });

      ctx.setData(res.data.Data);
      ctx.setTotal(res.data.Pagination.TotalCount);

      return res.data.Data;
    } finally {
      void $loading.done(200);
    }
  };
});

const onScroll: QTableProps['onVirtualScroll'] = function onScroll ({ index }) {
  const lastRowIndex = $recordLoader.rows.length - 1;

  if ($loading.loading === false && $recordLoader.pageIndex < $recordLoader.pageCount && index === lastRowIndex) {
    void $recordLoader.loadMore();
  }
};

watch(() => props.dayType, () => {
  void $recordLoader.reload();
}, { immediate: true });

</script>

<template>
  <q-table
    class="q-records-table tw-max-w-full"
    table-class="q-table-fixed tw-overflow-x-hidden"
    :rows="$recordLoader.rows"
    :columns="columns"
    :loading="$loading.loading"
    flat
    row-key=""
    virtual-scroll
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :pagination="pagination"
    :rows-per-page-options="[0]"
    @virtual-scroll="onScroll"
  >
    <!-- header -->
    <template #header-cell-status="headerCell">
      <q-th class="tw-w-[120px] tw-text-center">
        {{ headerCell.col.label }}
      </q-th>
    </template>

    <!-- body -->
    <template #body-cell-amount="cell">
      <q-td class="tw-text-right">
        ¥ <span class="tw-text-lg">{{ $currency(cell.value) }}</span>
      </q-td>
    </template>
    <template #no-data>
      <div>
        目前没有任何消息
      </div>
    </template>
  </q-table>
</template>

<style lang="scss">
.q-records-table {
  max-height: 600px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #fff
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  thead tr:first-child th {
    top: 0;
  }
}
</style>
