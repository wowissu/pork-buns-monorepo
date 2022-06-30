<script setup lang="ts">

import { useRecordApi } from '@pork-buns/core/api/record.api';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import type { QTableColumn, QTableProps } from 'quasar';
import { TransactionDateTypeEnum, TransactionTypeEnum, type WithdrawalRecord } from '@pork-buns/core/types/transactionRecord';
import { useRowsLoader } from '@/compositions/useRowsLoader';
import { useI18n } from 'vue-i18n';
import { $omitted } from '@/compositions/useOmitted';
import { watch } from 'vue';

const recordApi = useRecordApi();
const pagination = { rowsPerPage: 0 };
const $loading = useLoading();
const $i18n = useI18n();
const props = defineProps<{
  dayType: TransactionDateTypeEnum
}>();

const columns: QTableColumn<WithdrawalRecord>[] = [
  // { name: 'date', label: '日期', align: 'left', field: 'CreateDate', format: (val) => $date(val) },
  { name: 'no', label: '订单编号', align: 'left', field: 'WithdrawBillNo' },
  // { name: 'createDate', label: '提款时间', field: 'CreateDate' },
  { name: 'amount', label: '提款金额', field: 'Amount' },
  { name: 'account', label: '提款帐号', field: 'BankAccount' },
  { name: 'device', label: '操作端', field: 'DeviceType' },
  { name: 'status', label: '充值状态', field: 'Status', format: (val, row) => $i18n.t(`transactionRecord.ProcessStatus.T${row.ProcessType}S${row.Status}`) }
];

const $recordLoader = useRowsLoader([] as WithdrawalRecord[], (ctx) => {
  ctx.setSize(20);
  ctx.setIndex(1);
  ctx.setMinIndex(1);

  return async () => {
    try {
      $loading.start();

      const res = await recordApi.fetchRecord({
        DayType: props.dayType,
        TransactionType: TransactionTypeEnum.Withdrawals,
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
    <template #header-cell-no="headerCell">
      <q-th class="tw-w-[200px]">
        {{ headerCell.col.label }}
      </q-th>
    </template>

    <!-- body -->
    <template #body-cell-no="cell">
      <q-td class="!tw-py-0">
        <q-item dense clickable class="tw-py-1 tw-px-2 tw-w-full" @click="$copyNotify(cell.value)">
          <q-item-section>
            <q-item-label class="tw-text-lg tw-font-medium">
              {{ $omitted(cell.value) }}
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
    <template #body-cell-prizeAmount="cell">
      <q-td class="tw-text-right">
        <span
          :class="{
            'tw-text-positive': cell.row.Status === 1 && cell.row.WinloseAmount > 0,
            'tw-text-gray-600': cell.row.Status === 2,
            'tw-text-negative': cell.row.WinloseAmount <= 0
          }"
        >
          <template v-if="cell.row.StatusTextSub">
            {{ cell.row.StatusTextSub }}
          </template>
          <template v-else>
            ¥ <span class="tw-text-lg">{{ $currency(cell.row.WinloseAmount) }}</span>
          </template>
        </span>
      </q-td>
    </template>
    <template #body-cell-status="cell">
      <q-td class="tw-text-right">
        <span
          :class="{
            'tw-text-positive': cell.row.Status === 3,
            'tw-text-negative': [4,5,6].includes(cell.row.Status)
          }"
        >{{ cell.value }}</span>
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
