<script setup lang="ts">
import { useRule } from '@pork-buns/core/compositions/useRule';
import { QForm, QInput, useDialogPluginComponent, useQuasar, type QInputProps } from 'quasar';
import { computed, reactive, ref, unref } from 'vue';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import { useToggle } from '@pork-buns/core/compositions/useToggle';
import { useMemberStore } from '@/stores/member.store';
import { useMemberSecurityApi } from '@pork-buns/core/api/member.api';

interface ExposeOptions {
  type: QInputProps['type']
  icon: string
}

const $q = useQuasar();
const memberStore = useMemberStore();
const memeberSecurityApi = useMemberSecurityApi();
const $rules = useRule();
const formRef = ref<QForm>();
const $loading = useLoading();
const noBankPassword = computed(() => memberStore.member?.BankPasswordStatus === 0);

const newBankPasswordExpose = useToggle<ExposeOptions>(false, { type: 'text', icon: 'mdi-eye-outline' }, { type: 'password', icon: 'mdi-eye-off-outline' });
const duplicateBankPasswordExpose = useToggle<ExposeOptions>(false, { type: 'text', icon: 'mdi-eye-outline' }, { type: 'password', icon: 'mdi-eye-off-outline' });

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const userinput = reactive({
  password: '',
  oldBankPassword: '',
  newBankPassowrd: '',
  duplicateBankPassword: ''
});

async function submit () {
  if (!(await unref(formRef)?.validate())) {
    return;
  }

  try {
    $loading.start();

    if (noBankPassword.value) {
      // Submit for first time add bank password
      await memeberSecurityApi.addBankPassword(userinput.password, userinput.newBankPassowrd);
    } else {
      // Submit for change the old bank password
      await memeberSecurityApi.changeBankPassword(userinput.oldBankPassword, userinput.newBankPassowrd);
    }

    onDialogOK();

    $q.notify({
      message: '恭喜您，设置提款密码成功！',
      color: 'positive'
    });
  } finally {
    void $loading.done(200);
  }
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form ref="formRef" greedy @submit="submit">
        <q-card-section class="tw-flex tw-items-center tw-space-x-4">
          <q-icon name="mdi-alert-circle-outline" size="lg" color="primary" />
          <span class="tw-text-lg">
            修改提款密码
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="tw-space-y-2">
          <template v-if="noBankPassword">
            <div>
              <q-input v-model="userinput.password" :rules="[$rules.required(), $rules.password()]" outlined type="password" label="登录密码" />
            </div>
          </template>
          <template v-else>
            <div>
              <q-input v-model="userinput.oldBankPassword" :rules="[$rules.required(), $rules.password()]" outlined type="password" label="原提款密码" />
            </div>
          </template>
          <div>
            <q-input
              v-model="userinput.newBankPassowrd"
              :type="newBankPasswordExpose.value.type"
              :rules="[$rules.required(), $rules.password()]"
              outlined
              label="提款密码"
            >
              <template #append>
                <q-btn tabindex="-1" flat dense :icon="newBankPasswordExpose.value.icon" @click="newBankPasswordExpose.toggle()" />
              </template>
            </q-input>
          </div>
          <div>
            <q-input
              v-model="userinput.duplicateBankPassword"
              :type="duplicateBankPasswordExpose.value.type"
              :rules="[$rules.required(), $rules.eq(userinput.newBankPassowrd)]"
              outlined
              label="确认提款密码"
            >
              <template #append>
                <q-btn tabindex="-1" flat dense :icon="duplicateBankPasswordExpose.value.icon" @click="duplicateBankPasswordExpose.toggle()" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn color="primary" class="tw-flex-1" outline label="取消" @click="onDialogCancel" />
          <q-btn color="primary" type="submit" class="tw-flex-1" label="下一步" :loading="$loading.loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>