<script setup lang="ts">
import { useRule } from '@pork-buns/core/compositions/useRule';
import SmartContractSelect from '@/components/common/SmartContractSelect.vue';
import BasicSteps from '@/components/withdrawalAccount/BasicSteps.vue';
import { QInput, useDialogPluginComponent, useQuasar } from 'quasar';
import { reactive } from 'vue';
import { useWithdrawalCryptoStore } from '@/stores/withdrawalAccount.store';
import type { BaseInput } from '@pork-buns/core/types/bank';
import { ContractEnum } from '@pork-buns/core/types/crypto';

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const cryptoStore = useWithdrawalCryptoStore();
const $rules = useRule();

const userinput = reactive<{ usdtType: ContractEnum, usdtAddress: string }>({
  usdtType: ContractEnum.TRC20,
  usdtAddress: ''
});

async function addCryptoWalletSubmit (baseinput: BaseInput) {
  try {
    await cryptoStore.addCryptoWallet({
      Password: baseinput.password,
      BankPassword: baseinput.bankPassword,
      UsdtType: userinput.usdtType,
      Address: userinput.usdtAddress
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
  return cryptoStore.verifyBeforeAddCryptoWallet(password, bankPassword);
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="tw-flex tw-items-center tw-space-x-4">
        <q-icon name="mdi-alert-circle-outline" size="lg" color="primary" />
        <span class="tw-text-lg">
          添加电子钱包
        </span>
      </q-card-section>

      <q-separator />

      <BasicSteps :verify-fn="validatePassword" @submit="addCryptoWalletSubmit" @cancel="onDialogCancel">
        <div>
          <SmartContractSelect
            v-model="userinput.usdtType"
            :rules="[$rules.required()]"
            label="智能合约"
            placeholder="请选择智能合约"
          />
        </div>
        <div>
          <q-input
            v-model="userinput.usdtAddress"
            :rules="[$rules.required()]"
            outlined
            label="钱包地址"
            placeholder="请输入钱包地址"
          />
        </div>
      </BasicSteps>
    </q-card>
  </q-dialog>
</template>