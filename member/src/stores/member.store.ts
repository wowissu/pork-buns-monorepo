import { useAccessToken } from '@pork-buns/core/compositions/useAccessToken';
import { isApiAxiosError } from '@/plugins/memberApi.plugin';
import type { Member, MemberLoginUserInput, MemberVIP } from '@pork-buns/core/types/member';
import { defineStore } from 'pinia';
import numeral from 'numeral';
import { useQuasar } from 'quasar';
import { readonly, ref, toRef } from 'vue';
import { useLoading } from '@pork-buns/core/compositions/useLoading';
import { useMemberApi } from '@pork-buns/core/api/member.api';

export const $balanceLoading = useLoading();

export const useMemberStore = defineStore('member', () => {
  const $q = useQuasar();
  const $token = useAccessToken();
  const member = ref<Member>();
  const balance = ref<number>(0);
  const vip = ref<MemberVIP>();
  const memberApi = useMemberApi();

  async function login (postdata: MemberLoginUserInput) {
    try {
      const res = await memberApi.login(postdata);

      await $token.setToken(
        res.data.access_token,
        res.data.refresh_token,
        res.data['.expires']
      );
    } catch (err) {
      loginErrorHandler(err);
    }
  }

  async function fetchMyVIP () {
    const res = await memberApi.fetchVip();

    vip.value = res.data.Data;
  }

  async function fetchMember () {
    const res = await memberApi.fetchMember();

    member.value = res.data.Data;
  }

  async function fetchInfo () {
    return Promise.all([
      fetchMember(),
      fetchMyVIP()
    ]);
  }

  async function fetchBalance () {
    $balanceLoading.start();

    balance.value = 0;

    const res = await memberApi.fetchBalance();

    await $balanceLoading.done(500);

    balance.value = numeral(res.data.Data.Balance).value() ?? 0;
  }

  async function takeAllMoneyBack () {
    const res = await memberApi.takeAllBack();

    $q.notify({
      message: res.data.Message
    });
  }

  /** only for user without account name */
  function setAccountName (name: string) {
    if (member.value && member.value.Name) {
      throw new Error('Member got AccountName!');
    }

    return memberApi.changeName(name);
  }

  return {
    member,
    vip,
    balance,
    accessToken: $token.accessToken,
    refreshToken: $token.refreshToken,
    changeUserInfo: memberApi.changeUserInfo,
    login,
    fetchInfo,
    fetchMyVIP,
    fetchBalance,
    setAccountName,
    takeAllMoneyBack
  };
});


function loginErrorHandler (err: unknown) {
  if (!isApiAxiosError(err)) {
    throw err;
  }

  const $q = useQuasar();

  if (err.response) {
    $q.notify(err.response.data.error_description);
  }

  throw err;
}

export function mustMember (message = 'Should has member at this moment!') {
  const memberStore = useMemberStore();
  const member = toRef(memberStore, 'member');

  if (member.value === undefined) {
    throw new Error(message);
  }

  return readonly(member.value);
}