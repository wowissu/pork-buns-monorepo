<script setup lang="ts">
import { useRule } from '@/compositions/useRule';
import { useMemberStore } from '@/stores/member.store';
import { QForm, QInput, useDialogPluginComponent, useQuasar } from 'quasar';
import { reactive, ref, toRef, computed } from 'vue';
import { useCountdown } from '@/compositions/useCountdown';
import { useLoading } from '@/compositions/useLoading';

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const memberStore = useMemberStore();
const member = toRef(memberStore, 'member');
const $q = useQuasar();
const $rules = useRule();
const formRef = ref<QForm>();
const noEmail = computed(() => member.value?.EmailStatus === 0);
const newEmailInputRef = ref<QInput>();
const passwordInputRef = ref<QInput>();
const $counter = useCountdown();
const $sendVerifyCodeLoading = useLoading();
const $checkVerifyCodeLoading = useLoading();

const userinput = reactive({
  password: '',
  oldEmail: '',
  newEmail: '',
  validCode: ''
});

async function submit () {
  const v = await formRef.value?.validate();

  if (!v) {
    return;
  }

  try {
    $checkVerifyCodeLoading.start();

    await memberStore.verifyEmailCode(userinput.password, userinput.newEmail);

    void memberStore.fetchInfo();

    onDialogOK();

    $q.notify({
      message: '恭喜，邮箱修改成功！',
      color: 'positive'
    });
  } finally {
    void $checkVerifyCodeLoading.done(200);
  }
}

async function sendValidateMail () {
  const v = await Promise.all([
    passwordInputRef.value?.validate(),
    newEmailInputRef.value?.validate()
  ]);

  if (v.some(row => !row)) {
    return;
  }

  try {
    $sendVerifyCodeLoading.start();
    void $counter.start(60);

    await memberStore.sendEmailVerifyCode(userinput.password, userinput.newEmail, userinput.oldEmail);
  } catch (err) {
    $counter.stop();
    throw err;
  } finally {
    void $sendVerifyCodeLoading.done(200);
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
            {{ noEmail ? '添加电子邮箱' : '修改电子邮箱' }}
          </span>
        </q-card-section>

        <q-separator />

        <q-card-section class="tw-space-y-2">
          <div>
            <q-input ref="passwordInputRef" v-model="userinput.password" :rules="[$rules.required(), $rules.password()]" outlined type="password" placeholder="请输入登录密码" />
          </div>
          <div v-if="noEmail">
            <q-input v-model="userinput.oldEmail" :rules="[$rules.required(), $rules.email()]" outlined placeholder="请输入原始邮箱地址" />
          </div>
          <div>
            <q-input ref="newEmailInputRef" v-model="userinput.newEmail" :rules="[$rules.required(), $rules.email(), $rules.uneq(userinput.oldEmail, '电子邮箱重复！')]" outlined placeholder="请输入要绑定的邮箱地址" />
          </div>
          <div>
            <q-input v-model="userinput.validCode" :rules="[$rules.required()]" outlined placeholder="请输入验证码">
              <template #prepend>
                <div class="tw-bg-gery">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    :disable="$counter.count > 0"
                    no-caps
                    :loading="$sendVerifyCodeLoading.loading"
                    @click.stop.prevent="sendValidateMail()"
                  >
                    发送验证码 <span v-show="$counter.count">({{ $counter.count }}s)</span>
                  </q-btn>
                </div>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn color="primary" class="tw-flex-1" outline label="取消" @click="onDialogCancel" />
          <q-btn color="primary" type="submit" class="tw-flex-1" label="下一步" :loading="$checkVerifyCodeLoading.loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>