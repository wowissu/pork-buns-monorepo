<script setup lang="ts">
import { useRule } from '@/compositions/useRule';
import { QForm, QInput, useDialogPluginComponent, useQuasar, type QInputProps } from 'quasar';
import { computed, reactive, ref, unref } from 'vue';
import { useLoading } from '@/compositions/useLoading';
import { useToggle } from '@/compositions/useToggle';
import { useMemberStore } from '@/stores/member.store';

interface ExposeOptions {
  type: QInputProps['type']
  icon: string
}

const $q = useQuasar();
const memberStore = useMemberStore();
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
      await memberStore.addBankPassword(userinput.password, userinput.newBankPassowrd);
    } else {
      // Submit for change the old bank password
      await memberStore.changeBankPassword(userinput.oldBankPassword, userinput.newBankPassowrd);
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
            修改密码
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="tw-space-y-2">
          <template v-if="noBankPassword">
            <div>
              <q-input v-model="userinput.password" :rules="[$rules.required(), $rules.password()]" outlined type="password" placeholder="账号密码" />
            </div>
          </template>
          <template v-else>
            <div>
              <q-input v-model="userinput.oldBankPassword" :rules="[$rules.required(), $rules.password()]" outlined type="password" placeholder="原提款密码" />
            </div>
          </template>
          <div>
            <q-input
              v-model="userinput.newBankPassowrd"
              :type="newBankPasswordExpose.value.type"
              :rules="[$rules.required(), $rules.password()]"
              outlined
              placeholder="提款密码"
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
              placeholder="确认提款密码"
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