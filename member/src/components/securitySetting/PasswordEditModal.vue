<script setup lang="ts">
import { useRule } from '@pork-buns/core/compositions/useRule';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import { useToggle } from '@pork-buns/core/compositions/useToggle';
import { QForm, QInput, useDialogPluginComponent, useQuasar, type QInputProps } from 'quasar';
import { reactive, ref, unref } from 'vue';
import { useMemberApi } from '@pork-buns/core/api/member.api';

interface ExposeOptions {
  type: QInputProps['type']
  icon: string
}

const $q = useQuasar();
const memberApi = useMemberApi();
const $rules = useRule();
const formRef = ref<QForm>();
const $loading = useLoading();
const newPasswordExpose = useToggle<ExposeOptions>(false, { type: 'text', icon: 'mdi-eye-outline' }, { type: 'password', icon: 'mdi-eye-off-outline' });
const duplicatePasswordExpose = useToggle<ExposeOptions>(false, { type: 'text', icon: 'mdi-eye-outline' }, { type: 'password', icon: 'mdi-eye-off-outline' });

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const userinput = reactive({
  oldPassword: '',
  newPassowrd: '',
  duplicatePassword: ''
});

async function submit () {
  if (!(await unref(formRef)?.validate())) {
    return;
  }

  $loading.start();

  try {
    await memberApi.changePassword(userinput.oldPassword, userinput.newPassowrd);

    onDialogOK();

    $q.notify({
      message: '恭喜您，设置登录密码成功！',
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
            修改密码
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="tw-space-y-2">
          <div>
            <q-input v-model="userinput.oldPassword" :rules="[$rules.required(), $rules.password()]" outlined type="password" placeholder="原登录密码" />
          </div>
          <div>
            <q-input
              v-model="userinput.newPassowrd"
              :type="newPasswordExpose.value.type"
              :rules="[$rules.required(), $rules.password()]"
              outlined
              placeholder="修改密码"
            >
              <template #append>
                <q-btn tabindex="-1" flat dense :icon="newPasswordExpose.value.icon" @click="newPasswordExpose.toggle()" />
              </template>
            </q-input>
          </div>
          <div>
            <q-input
              v-model="userinput.duplicatePassword"
              :type="duplicatePasswordExpose.value.type"
              :rules="[$rules.required(), $rules.eq(userinput.newPassowrd)]"
              outlined
              placeholder="确认新密码"
            >
              <template #append>
                <q-btn tabindex="-1" flat dense :icon="duplicatePasswordExpose.value.icon" @click="duplicatePasswordExpose.toggle()" />
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