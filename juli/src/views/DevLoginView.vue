<script setup lang="ts">
import { useMemberStore } from '@/stores/member.store';
import { ref } from 'vue';
import { useVerifyCode } from '@/compositions/useVerifyCode';
import { useRouter } from 'vue-router';
import { MemberMenuEnum } from '@pork-buns/core/const/menu.const';

const memberStore = useMemberStore();

const router = useRouter();
const userName = ref('su8888');
const password = ref('123456');
const { verifyKey, verifyCode, verifyUrl, reset: verifyReset } = useVerifyCode();

async function onSubmit () {
  try {
    await memberStore.login({
      userName: userName.value,
      password: password.value,
      verifyKey: verifyKey.value,
      verifyCode: verifyCode.value
    });

    // jump to home
    void router.push({ name: MemberMenuEnum.UserInfo });
  } catch (err) {
    verifyReset();
  }
}

function onReset () {
  userName.value = '';
  password.value = '';

  verifyReset();
}
</script>

<template>
  <div class="tw-container tw-mx-auto tw-p-20">
    <div class="tw-w-[300px]">
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-input
          v-model="userName"
          filled
          label="帳號 *"
        />

        <q-input
          v-model="password"
          filled
          type="password"
          label="密碼 *"
        />

        <q-img :src="verifyUrl" @click="verifyReset()" />
        <q-input
          v-model="verifyKey"
          filled
          type="text"
          label="驗證碼 *"
        >
          <!-- <template #after>
            <img :src="verifyUrl" alt="">

          </template> -->
        </q-input>

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </div>
</template>
