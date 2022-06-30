<script setup lang="ts">
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { useGameStore } from '@/stores/game.store';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import type { Game } from '@pork-buns/core/types/game';
import dayjs from 'dayjs';
import type { QTableColumn, QTableProps } from 'quasar';
import { reactive, ref } from 'vue';
import type { BetRecord } from '@pork-buns/core/types/betRecord';
import { useRowsLoader } from '@/compositions/useRowsLoader';
import { datetimeFormat } from '@pork-buns/core/const/common.const';
import {useRecordApi} from '@pork-buns/core/api/record.api';

interface UserQuery {
  endDate: string
  startDate: string
  game: Game
}

// stores
const gameStore = useGameStore();
const recordApi = useRecordApi();

// pick date
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const today = dayjs();
const navigationMinYearMonth = today.subtract(1, 'month').format(monthFormat);
const navigationMaxYearMonth = today.add(1, 'month').format(monthFormat);
const defaultStartDate = dayjs().subtract(14, 'd').format(dateFormat);
const defaultEndDate = dayjs().format(dateFormat);
const searchRange = ref({ from: defaultStartDate, to: defaultEndDate });

// records
const $loading = useLoading();

const columns: QTableColumn<BetRecord>[] = [
  { name: 'status', label: '注单状态', field: 'StatusText' },
  { name: 'no', label: '注单编号', align: 'left', field: 'TransSN' },
  { name: 'platform', label: '游戏平台', field: 'PlatformName' },
  { name: 'betAmount', label: '投注金额', field: 'ValidBetAmount' },
  { name: 'prizeAmount', label: '奖金金额', field: 'WinloseAmount' }
];

const pagination = { rowsPerPage: 0 };
const defaultGameOption: Game = { GameCode: '', GameTypeID: -1, PlatformEName: '-1', PlatformID: -1, Sequence: 0, ShowName: '全部游戏' };
const userquery = reactive<UserQuery>({ endDate: defaultEndDate, startDate: defaultStartDate, game: defaultGameOption });

const $recordLoader = useRowsLoader([] as BetRecord[], (ctx) => {
  ctx.setSize(20);
  ctx.setIndex(1);
  ctx.setMinIndex(1);

  return async (query: UserQuery = userquery) => {
    try {
      $loading.start();

      const res = await recordApi.fetchBetRecords({
        PlatformCode: query.game.PlatformEName,
        PlatformName: query.game.ShowName,
        GameTypeID: query.game.GameTypeID,
        StartDate: dayjs(query.startDate).startOf('d').format(datetimeFormat),
        EndDate: dayjs(query.endDate).endOf('d').format(datetimeFormat),
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

function selectAllGame () {
  userquery.game = defaultGameOption;
}

function searchSubmit () {
  return $recordLoader.reload(userquery);
}

const onScroll: QTableProps['onVirtualScroll'] = function onScroll ({ index }) {
  const lastRowIndex = $recordLoader.rows.length - 1;

  if ($loading.loading === false && $recordLoader.pageIndex < $recordLoader.pageCount && index === lastRowIndex) {
    void $recordLoader.loadMore(userquery);
  }
};

function dateFilter (date: string) {
  const includeStartAndEnd = '[]';
  const twoWeeksAgo = today.subtract(2, 'week');

  return dayjs(date).isBetween(twoWeeksAgo, today, 'd', includeStartAndEnd);
}

function omitted (val: string) {
  // console.log(val, `${val.substring(0, 4)}...${val.substring(val-4)}`);

  return val.length > 10 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : val;
}

searchSubmit();

</script>

<template>
  <MemberContentLayout title="投注记录">
    <q-card-section>
      <q-form @submit="searchSubmit()">
        <div class="tw-flex tw-py-4 tw-space-x-4 tw-items-center">
          <q-field
            color="primary"
            stack-label
            mask="####/##/##"
            outlined
            dense
          >
            <template #before>
              <div class="tw-text-base">
                投注时间
              </div>
            </template>
            <template #control>
              <div>
                {{ searchRange?.from }} - {{ searchRange?.to }}
              </div>
            </template>
            <template #append>
              <q-icon name="mdi-calendar" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model.lazy="searchRange"
                    range
                    no-unset
                    :options="dateFilter"
                    :navigation-min-year-month="navigationMinYearMonth"
                    :navigation-max-year-month="navigationMaxYearMonth"
                  >
                    <!-- <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div> -->
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-field>
          <q-select
            v-model="userquery.game"
            placeholder="全部游戏"
            class="tw-min-w-[200px]"
            outlined
            dense
            option-label="ShowName"
            map-options
            :options="gameStore.games"
          >
            <template #before-options>
              <q-item v-close-popup clickable @click="selectAllGame">
                <q-item-section>
                  <q-item-label>
                    全部游戏
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div>
            <q-btn type="submit" color="primary" label="查询" size="md" />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
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
          <q-th class="tw-w-[70px]">
            {{ headerCell.col.label }}
          </q-th>
        </template>
        <template #header-cell-no="headerCell">
          <q-th class="tw-w-[200px]">
            {{ headerCell.col.label }}
          </q-th>
        </template>
        <template #header-cell-platform="headerCell">
          <q-th class="tw-w-[70px]">
            {{ headerCell.col.label }}
          </q-th>
        </template>
        <!-- body -->
        <template #body-cell-no="cell">
          <q-td class="!tw-py-0">
            <q-item dense clickable class="tw-py-1 tw-px-2 tw-group tw-w-full" @click="$copyNotify(cell.value)">
              <q-item-section>
                <q-item-label class="tw-text-lg tw-font-medium">
                  {{ omitted(cell.value) }}
                </q-item-label>
                <q-item-label caption>
                  {{ $date(cell.row.CreateDate) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon class="tw-hidden group-hover:tw-block" name="mdi-content-copy" color="primary" size="xs" />
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template #body-cell-betAmount="cell">
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
                'tw-text-positive': cell.row.Status > 0,
                'tw-text-negative': cell.row.Status === 0
              }"
            >{{ cell.row.StatusText }}</span>
          </q-td>
        </template>

        <!-- <template #body-cell-title="cell">
          <q-td class="tw-w-auto">
            <q-item flat class="tw-cursor-pointer" clickable>
              <q-item-section>
                <q-item-label class="tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis">
                  <div class="tw-flex tw-items-center tw-space-x-2">
                    <div>
                      {{ cell.value }}
                    </div>
                    <q-icon v-show="!cell.row.IsRead" name="mdi-record" class="tw-text-negative" />
                  </div>
                </q-item-label>
                <q-item-label caption>
                  {{ $date(cell.row.CreateDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template> -->
        <!-- <template #body-cell-actions="cell">
          <q-td class="tw-w-auto">
            <q-btn dense flat icon="mdi-trash-can-outline" class="hover:tw-text-negative" @click="deleteMessage(cell.row)" />
          </q-td>
        </template> -->
        <template #no-data>
          <div>
            目前没有任何消息
          </div>
        </template>
      </q-table>
    </q-card-section>
  </MemberContentLayout>
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
