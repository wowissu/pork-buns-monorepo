<script setup lang="ts">
import { useRule } from '@pork-buns/core/compositions/useRule';
import { QForm, QInput } from 'quasar';
import { reactive, ref, unref } from 'vue';
import { useCountdown } from '@pork-buns/core/compositions/useCountdown';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import { useMemberStore } from '@/stores/member.store';

const memberStore = useMemberStore();
const $rules = useRule();
const formRef = ref<QForm>();
const newCellphoneInputRef = ref<QInput>();
const passwordInputRef = ref<QInput>();
const $counter = useCountdown();
const $sendVerifyCodeLoading = useLoading();
const $checkVerifyCodeLoading = useLoading();

const userinput = reactive({
  password: '',
  cellphone: '',
  validCode: ''
});

const emits = defineEmits<{
  (e: 'cancel'): void,
  (e: 'ok'): void,
}>();

async function submit () {
  if (!(await unref(formRef)?.validate())) {
    return;
  }

  $checkVerifyCodeLoading.start();

  try {
    await memberStore.verifyCellphoneCode(userinput.password, userinput.cellphone);

    emits('ok');
  } finally {
    void $checkVerifyCodeLoading.done(200);
  }
}

async function sendValidateMail () {
  const v = await Promise.all([
    unref(passwordInputRef)?.validate(),
    unref(newCellphoneInputRef)?.validate()
  ]);

  if (v.some(row => !row)) {
    return;
  }

  try {
    $sendVerifyCodeLoading.start();
    void $counter.start(60);

    await memberStore.sendCellphoneVerifyCode(userinput.password, userinput.cellphone, 0, 0, 1);
  } catch (err) {
    $counter.stop();
    throw err;
  } finally {
    void $sendVerifyCodeLoading.done(200);
  }
}
</script>

<template>
  <q-form ref="formRef" greedy @submit="submit">
    <q-card-section class="tw-flex tw-items-center tw-space-x-4">
      <q-icon name="mdi-alert-circle-outline" size="lg" color="primary" />
      <span class="tw-text-lg">
        验证原有手机
      </span>
    </q-card-section>

    <q-separator />

    <q-card-section class="tw-space-y-2">
      <div>
        <q-input ref="passwordInputRef" v-model="userinput.password" :rules="[$rules.required(), $rules.password()]" outlined type="password" placeholder="请输入登录密码" />
      </div>
      <div>
        <q-input ref="cellphoneInputRef" v-model="userinput.cellphone" :rules="[$rules.required(), $rules.phone()]" outlined placeholder="请输入要添加手机号码" />
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
      <q-btn color="primary" class="tw-flex-1" outline label="取消" @click="emits('cancel')" />
      <q-btn color="primary" type="submit" class="tw-flex-1" label="下一步" :loading="$checkVerifyCodeLoading.loading" />
    </q-card-actions>
  </q-form>
</template>