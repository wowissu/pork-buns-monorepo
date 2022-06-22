<script setup lang="ts">
import { useMemberStore } from '@/stores/member.store';
import { useDialogPluginComponent } from 'quasar';
import { ref, watch, computed } from 'vue';
import OldCellphoneTab from './OldCellphoneTab.vue';
import NewCellphoneTab from './NewCellphoneTab.vue';

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

defineEmits([
  ...useDialogPluginComponent.emits
]);

enum TabEnum {
  OldCellphone = 'oldCellphoneTab',
  NewCellphone = 'newCellphoneTab'
}
const tab = ref<TabEnum>(TabEnum.NewCellphone);

const memberStore = useMemberStore();
const noCellphone = computed(() => memberStore.member?.CellPhoneStatus === 0);

watch(noCellphone, (val) => {
  if (!val) {
    tab.value = TabEnum.OldCellphone;
  }
}, { immediate: true });

function tabTo (t: TabEnum) {
  tab.value = t;
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-tab-panels v-model="tab" keep-alive animated>
        <q-tab-panel v-if="!noCellphone" :name="TabEnum.OldCellphone" class="tw-p-0">
          <OldCellphoneTab @cancel="onDialogCancel" @ok="tabTo(TabEnum.NewCellphone)" />
        </q-tab-panel>
        <q-tab-panel :name="TabEnum.NewCellphone" class="tw-p-0">
          <NewCellphoneTab :no-cellphone="noCellphone" @cancel="onDialogCancel" @submit="onDialogOK">
            <template v-if="!noCellphone" #title-prefix>
              <q-btn flat icon="mdi-arrow-left" dense @click="tabTo(TabEnum.OldCellphone)" />
            </template>
          </NewCellphoneTab>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>