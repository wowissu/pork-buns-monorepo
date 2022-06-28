<script setup lang="ts">

import { useTransactionRecordStore } from '@/stores/transactionRecord.store';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import type { QTableColumn, QTableProps } from 'quasar';
import { TransactionDateTypeEnum, TransactionTypeEnum, type OthersRecord } from '@pork-buns/core/types/transactionRecord';
import { useRowsLoader } from '@/compositions/useRowsLoader';
import { useI18n } from 'vue-i18n';
import { $date } from '@pork-buns/core/compositions/useDate';

const transcationRecordStore = useTransactionRecordStore();
const pagination = { rowsPerPage: 0 };
const $loading = useLoading();
const $i18n = useI18n();
const props = defineProps<{
  dayType: TransactionDateTypeEnum
}>();

const columns: QTableColumn<OthersRecord>[] = [
  { name: 'type', label: '类型', align: 'left', field: 'TypeName', format: (val: string) => $i18n.t(`transactionRecord.Others.${val}`) },
  { name: 'amount', label: '变动金额', field: 'Amount' },
  { name: 'note', label: '备注', field: 'NoteComplete' }
];

const $recordLoader = useRowsLoader([] as OthersRecord[], (ctx) => {
  ctx.setSize(20);
  ctx.setIndex(1);
  ctx.setMinIndex(1);

  return async () => {
    try {
      $loading.start();

      const res = await transcationRecordStore.fetchRecord({
        DayType: props.dayType,
        TransactionType: TransactionTypeEnum.Others,
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

void $recordLoader.reload();

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
    <template #header-cell-type="headerCell">
      <q-th class="tw-w-[200px] tw-text-center">
        {{ headerCell.col.label }}
      </q-th>
    </template>
    <template #header-cell-amount="headerCell">
      <q-th class="tw-w-[150px] tw-text-center">
        {{ headerCell.col.label }}
      </q-th>
    </template>

    <!-- body -->
    <template #body-cell-type="cell">
      <q-td class="!tw-py-0">
        <q-item dense class="tw-py-1 tw-px-2 tw-w-full">
          <q-item-section>
            <q-item-label class="tw-text-base tw-font-medium">
              {{ cell.value }}
            </q-item-label>
            <q-item-label caption>
              {{ $date(cell.row.CreateDate) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>

    <template #body-cell-amount="cell">
      <q-td class="tw-text-right">
        ¥ <span class="tw-text-lg">{{ $currency(cell.value) }}</span>
      </q-td>
    </template>
    <template #body-cell-note="cell">
      <q-td class="tw-text-right tw-text-ellipsis tw-overflow-x-hidden">
        {{ cell.value }}
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
