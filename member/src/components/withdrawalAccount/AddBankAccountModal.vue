useWithdrawalBankStore<script setup lang="ts">
import { useRule } from '@pork-buns/core/compositions/useRule';
import ProvinceSelect from '@/components/common/ProvinceSelect.vue';
import CitySelect from '@/components/common/CitySelect.vue';
import BankSelect from '@/components/common/BankSelect.vue';
import BasicSteps from '@/components/withdrawalAccount/BasicSteps.vue';
import { QInput, useDialogPluginComponent, useQuasar } from 'quasar';
import { reactive } from 'vue';
import { useWithdrawalBankStore } from '@/stores/withdrawalAccount.store';
import type { BaseInput } from '@pork-buns/core/types/bank';

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const bankStore = useWithdrawalBankStore();
const $rules = useRule();

const userinput = reactive({
  provinceId: undefined as number | undefined,
  cityId: undefined as number | undefined,
  bankId: undefined as number | undefined,
  bankAccount: '',
  bankBranch: ''
});

async function addBankAccountSubmit (baseinput: BaseInput) {
  try {
    await bankStore.addBankAccount({
      Password: baseinput.password,
      BankPassword: baseinput.bankPassword,
      AccountName: baseinput.name,
      BankID: userinput.bankId!,
      BankBranch: userinput.bankBranch,
      BankAccount: userinput.bankAccount,
      BankProvinceID: userinput.provinceId!,
      BankCity: userinput.cityId!
    });

    onDialogOK();

    $q.notify({
      message: '新增成功！',
      color: 'positive'
    });
  } finally {
    baseinput.resolve();
  }
}

function validatePassword (password: string, bankPassword: string) {
  return bankStore.verifyBeforeAddBankAccount(password, bankPassword);
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="tw-flex tw-items-center tw-space-x-4">
        <q-icon name="mdi-alert-circle-outline" size="lg" color="primary" />
        <span class="tw-text-lg">
          添加银行卡
        </span>
      </q-card-section>

      <q-separator />

      <BasicSteps :verify-fn="validatePassword" @submit="addBankAccountSubmit" @cancel="onDialogCancel">
        <div>
          <BankSelect
            v-model="userinput.bankId"
            :rules="[$rules.required()]"
            label="银行"
          />
        </div>
        <div>
          <q-input
            v-model="userinput.bankBranch"
            :rules="[$rules.required()]"
            outlined
            label="开户分行"
            placeholder="请输入开户分行"
          />
        </div>
        <div>
          <q-input
            v-model="userinput.bankAccount"
            :rules="[$rules.required(), $rules.bankAccount()]"
            outlined
            label="银行卡号"
            placeholder="请输入银行卡号"
          />
        </div>
        <div>
          <ProvinceSelect
            v-model="userinput.provinceId"
            :rules="[$rules.required()]"
            label="省份"
          />
        </div>
        <div>
          <CitySelect
            v-model="userinput.cityId"
            :rules="[$rules.required()]"
            :disable="!userinput.provinceId"
            :province-id="userinput.provinceId"
            label="开户城市"
          />
        </div>
      </BasicSteps>
    </q-card>
  </q-dialog>
</template>