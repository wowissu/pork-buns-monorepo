<script setup lang="ts">
import { useRule } from '@/compositions/useRule';
import { QForm, QInput, type QInputProps } from 'quasar';
import { reactive, ref, unref, watch, computed } from 'vue';
import { useLoading } from '@/compositions/useLoading';
import { useToggle } from '@/compositions/useToggle';
import { useMemberStore } from '@/stores/member.store';
import type { BaseInput } from '@/types/bank';

enum StepEnum {
  VerifyPassword = 0,
  SetAccountName = 1,
  Finally = 2
}

interface ExposeOptions {
  type: QInputProps['type']
  icon: string
}

const props = defineProps<{
  verifyFn: (password: string, bankPassword: string) => Promise<unknown>;
}>();

const emits = defineEmits<{
  (e: 'submit', val: BaseInput): void
  (e: 'cancel'): void
}>();

const memberStore = useMemberStore();
const $rules = useRule();
const formRef = ref<QForm>();
const $loading = useLoading();
const bankpasswordExpose = useToggle<ExposeOptions>(false, { type: 'text', icon: 'mdi-eye-outline' }, { type: 'password', icon: 'mdi-eye-off-outline' });
const step = ref(StepEnum.VerifyPassword);
const hasUsername = computed(() => Boolean(memberStore.member?.Name));

const baseinput = reactive<Omit<BaseInput, 'resolve'>>({
  password: '',
  bankPassword: '',
  name: ''
});

watch(() => memberStore.member, (member) => {
  baseinput.name = member?.Name ?? '';
}, { immediate: true });

function isLegacyStep (s: StepEnum) {
  return step.value > s;
}

async function submit () {
  if (!(await unref(formRef)?.validate())) {
    return;
  }

  $loading.start();
  formRef.value?.resetValidation();

  try {
    switch (step.value) {
      case StepEnum.VerifyPassword:
        await verifyPasswordSubmit();
        break;
      case StepEnum.SetAccountName:
        await setAccountNameSubmit();
        break;
      case StepEnum.Finally:
        await new Promise((resolve) => {
          emits('submit', { password: baseinput.password, bankPassword: baseinput.bankPassword, name: baseinput.name, resolve });
        });
        break;
      default:
        throw new Error (`The step "${StepEnum[step.value]}" have no matched action.`);
    }
  } finally {
    void $loading.done(200);
  }
}

async function verifyPasswordSubmit () {
  await props.verifyFn(baseinput.password, baseinput.bankPassword);

  if (hasUsername.value) {
    step.value = StepEnum.Finally;
  } else {
    step.value = StepEnum.SetAccountName;
  }
}

async function setAccountNameSubmit () {
  /** Only work when member without account name */
  if (memberStore.member && !memberStore.member.Name) {
    await memberStore.setAccountName(baseinput.name);
  }

  step.value = StepEnum.Finally;
}

</script>

<template>
  <q-form ref="formRef" greedy @submit="submit">
    <!-- Verify password -->
    <q-card-section class="tw-space-y-2" :class="{ 'tw-bg-gray-100': isLegacyStep(StepEnum.VerifyPassword) }">
      <div>
        <q-input
          v-model="baseinput.password"
          :rules="[$rules.required(), $rules.password()]"
          outlined
          type="password"
          label="账号密码"
          placeholder="请输入您账号密码"
          :readonly="isLegacyStep(StepEnum.VerifyPassword)"
          :hide-bottom-space="isLegacyStep(StepEnum.VerifyPassword)"
          :dense="isLegacyStep(StepEnum.VerifyPassword)"
        />
      </div>
      <div>
        <q-input
          v-model="baseinput.bankPassword"
          :type="bankpasswordExpose.value.type"
          :rules="[$rules.required(), $rules.password()]"
          outlined
          label="提款密码"
          placeholder="请输入您提款密码"
          :readonly="isLegacyStep(StepEnum.VerifyPassword)"
          :hide-bottom-space="isLegacyStep(StepEnum.VerifyPassword)"
          :dense="isLegacyStep(StepEnum.VerifyPassword)"
        >
          <template #append>
            <q-btn tabindex="-1" flat dense :icon="bankpasswordExpose.value.icon" @click="bankpasswordExpose.toggle()" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <!-- Set account name -->
    <q-slide-transition>
      <div v-if="step >= StepEnum.SetAccountName">
        <q-separator />
        <q-card-section class="tw-space-y-2" :class="{ 'tw-bg-gray-100': isLegacyStep(StepEnum.SetAccountName) }">
          <div>
            <q-input
              v-model="baseinput.name"
              :rules="[$rules.required()]"
              outlined
              label="姓名"
              placeholder="请设置您的姓名"
              :readonly="hasUsername"
              :hide-bottom-space="isLegacyStep(StepEnum.SetAccountName)"
              :dense="isLegacyStep(StepEnum.SetAccountName)"
            />
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>

    <!-- Set bank account -->
    <q-slide-transition>
      <div v-if="step >= StepEnum.Finally">
        <q-separator />
        <q-card-section class="tw-space-y-2">
          <slot name="default" :loading="$loading.loading" />
        </q-card-section>
      </div>
    </q-slide-transition>

    <q-separator />

    <q-card-actions align="center">
      <q-btn color="primary" class="tw-flex-1" outline label="取消" @click="emits('cancel')" />
      <q-btn color="primary" type="submit" class="tw-flex-1" label="下一步" :loading="$loading.loading" />
    </q-card-actions>
  </q-form>
</template>