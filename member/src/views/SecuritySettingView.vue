<script setup lang="ts">
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import { useMemberStore } from '@/stores/member.store';
import { useQuasar } from 'quasar';
import { computed, defineAsyncComponent, toRef } from 'vue';

const $q = useQuasar();
const memberStore = useMemberStore();
const member = toRef(memberStore, 'member');
const noValidEmail = computed(() => memberStore.member?.EmailStatus === 0);
const noValidCellPhone = computed(() => memberStore.member?.CellPhoneStatus === 0);
const noBankPassword = computed(() => memberStore.member?.BankPasswordStatus === 0);

function showEmailEditModel () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/securitySetting/EmailEditModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  });
}

function showCellphoneEditModel () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/securitySetting/CellphoneEditModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  });
}

function showPasswordEditModal () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/securitySetting/PasswordEditModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  });
}

function showBankPasswordEditModal () {
  $q.dialog({
    component: defineAsyncComponent(() => import('@/components/securitySetting/BankPasswordEditModal.vue')),
    componentProps: {
      noBackdropDismiss: true
    }
  });
}
</script>

<template>
  <MemberContentLayout title="安全管理">
    <q-card-section class="tw-max-w-[800px] tw-mx-auto">
      <div class="tw-flex tw-flex-col tw-space-y-4 tw-py-8">
        <!-- Email -->
        <div>
          <q-input
            :model-value="member?.Email"
            outlined
            lazy-rules
            label="电子邮箱"
            placeholder="请输入邮箱地址"
            readonly
            hint="用于找回登录密码、接受平台发送的活动通知等，提高账号安全性"
          >
            <template #append>
              <span v-if="noValidEmail" class="tw-text-base tw-text-negative">未验证</span>
              <span v-else class="tw-text-base tw-text-positive">已设置</span>
            </template>
            <template #after>
              <q-btn color="primary" @click="showEmailEditModel">
                {{ noValidEmail ? '添加电子邮箱' : '修改电子邮箱' }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <!-- Cellphone -->
        <div>
          <q-input
            :model-value="member?.CellPhone"
            outlined
            lazy-rules
            label="手机号码"
            placeholder="请输入手机号码"
            readonly
            hint="用于登录账号、找回账户密码、接受平台及时联系、享受平台及时服务等，提高账户安全性"
          >
            <template #append>
              <span v-if="noValidCellPhone" class="tw-text-base tw-text-negative">未验证</span>
              <span v-else class="tw-text-base tw-text-positive">已设置</span>
            </template>
            <template #after>
              <q-btn color="primary" @click="showCellphoneEditModel">
                {{ noValidCellPhone ? '添加手机号码' : '修改手机号码' }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <!-- Password -->
        <div>
          <q-input
            model-value="*****"
            outlined
            lazy-rules
            label="登录密码"
            placeholder="请输入登录密码"
            readonly
            hint="用于登陆账户、设置提款密码、确保账户安全访问等，提高账户安全性"
          >
            <template #after>
              <q-btn color="primary" @click="showPasswordEditModal">
                修改登录密码
              </q-btn>
            </template>
          </q-input>
        </div>
        <!-- BankPassword -->
        <div>
          <q-input
            model-value="*****"
            outlined
            lazy-rules
            label="提款密码"
            placeholder="请输入提款密码"
            readonly
            hint="用于提款时的验证、确保提款安全，设置完成之后，请妥善保管"
          >
            <template #after>
              <q-btn color="primary" @click="showBankPasswordEditModal">
                {{ noBankPassword ? '设置提款密码' : '修改提款密码' }}
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
  </MemberContentLayout>
</template>
