<script setup lang="ts">
import { $date } from '@/compositions/useDate';
import { useLoading } from '@/compositions/useLoading';
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { useMessageStore } from '@/stores/message.store';
import type { Message } from '@pork-buns/core/types/common';
import { useQuasar, type QTableColumn, type QTableProps } from 'quasar';
import { ref } from 'vue';
import { usePersistenRef } from '@/compositions/usePersistentRef';

const columns: QTableColumn<Message>[] = [
  // { name: 'status', required: true, label: '状态', align: 'left', field: row => row.IsRead ? '已读' : '未读' },
  // { name: 'createDate', align: 'left', label: '时间', field: 'CreateDate', format: (val) => $date(val) },
  { name: 'title', align: 'left', label: '标题/时间', field: 'Title' },
  { name: 'actions', label: '操作', field: 'InternalMailID' }
];

const $q = useQuasar();
const messageStore = useMessageStore();
const pagination = ref({ rowsPerPage: 0 });

// const rows = ref<Message[]>([]);
const $loading = useLoading();
const nextPage = ref(1);
const onlyShowUnread = usePersistenRef('only-show-unread-messages', true);
const viewingMessage = ref<Message>();
const showMessageContent = ref(false);

void messageStore.fectMessages(nextPage.value);

const onScroll: QTableProps['onVirtualScroll'] = function onScroll ({ to }) {
  const lastIndex = messageStore.messages.length - 1;

  if ($loading.loading === false && nextPage.value < messageStore.pageCount && to === lastIndex) {
    $loading.start();

    nextPage.value += 1;

    void messageStore.fectMessages(nextPage.value)
      .finally(() => {
        void $loading.done(200);
      });
  }
};

function filterRows (rows: Message[]) {
  const result = onlyShowUnread.value ? rows.filter(r => r.IsRead === 0) : rows;

  return result;
}

function messagePopup (message: Message) {
  viewingMessage.value = message;
  showMessageContent.value = true;

  if (message.IsRead === 0) {
    void messageStore.readMessage(message.InternalMailID);
  }
}

function deleteMessage (message: Message) {
  function deleteIt () {
    return messageStore.deleteMessage(message.InternalMailID);
  }

  $q.notify({
    message: `确定要删除 ${message.Title} 吗？`,
    color: 'negative',
    icon: 'mdi-alert-circle-outline',
    actions: [
      { label: '确定', color: 'white', handler: () => void deleteIt() },
      { label: '取消', color: 'white' }
    ]
  });
}

</script>

<template>
  <MemberContentLayout title="消息中心">
    <q-card-section>
      <div>
        <q-checkbox v-model="onlyShowUnread" label="只显示未读" dense />
      </div>
      <q-table
        class="q-messages-table"
        table-class="tw-overflow-x-hidden"
        :rows="messageStore.messages"
        :columns="columns"
        :loading="$loading.loading"
        flat
        row-key="InternalMailID"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        filter="IsRead"
        :filter-method="filterRows"
        @virtual-scroll="onScroll"
      >
        <!-- <template #header-cell-title="headerCell">
          <q-th>
            <div class="tw-flex tw-items-center">
              <div>
                {{ headerCell.col.label }}
              </div>
              <div>
                <q-checkbox v-model="onlyShowUnread" label="只显示未读" dense />
              </div>
            </div>
          </q-th>
        </template> -->
        <template #header-cell-actions="headerCell">
          <q-th class="tw-w-[60px]">
            {{ headerCell.col.label }}
          </q-th>
        </template>

        <template #body-cell-title="cell">
          <q-td class="tw-w-auto">
            <q-item flat class="tw-cursor-pointer" clickable @click="messagePopup(cell.row)">
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
        </template>
        <template #body-cell-actions="cell">
          <q-td class="tw-w-auto">
            <q-btn dense flat icon="mdi-trash-can-outline" class="hover:tw-text-negative" @click="deleteMessage(cell.row)" />
          </q-td>
        </template>
        <template #no-data>
          <div>
            目前没有任何消息
          </div>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="showMessageContent" no-backdrop-dismiss>
      <q-card>
        <q-card-section class="tw-flex tw-items-center tw-pb-0 tw-space-x-4">
          <div class="text-h6">
            {{ viewingMessage?.Title }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="mdi-close" flat round dense />
        </q-card-section>

        <q-card-section>
          {{ viewingMessage?.Content }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </MemberContentLayout>
</template>

<style lang="scss">
.q-table-fixed {
  .q-table {
    table-layout: fixed;
    width: 100%;
  }
}

.q-messages-table {
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
