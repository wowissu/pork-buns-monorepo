import { useAccessToken } from '@/compositions/useAccessToken';
import { isApiAxiosError, useApi } from '@/plugins/api.plugin';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import type { Member, MemberEditPostdata, MemberLoginResponse, MemberLoginUserInput, MemberVIP } from '@pork-buns/core/types/member';
import { defineStore } from 'pinia';
import numeral from 'numeral';
import { useQuasar } from 'quasar';
import { readonly, ref, toRef } from 'vue';
import { useLoading } from '@/compositions/useLoading';

export const $balanceLoading = useLoading();

export const useMemberStore = defineStore('member', () => {
  const $q = useQuasar();
  const api = useApi();
  const $token = useAccessToken();
  const member = ref<Member>();
  const balance = ref<number>(0);

  const vip = ref<MemberVIP>();
  // const vip = computed(() => {
  //   return
  //   return useVIPStore().levels.find(l => l.Level === member.value?.VIPLevel);
  // });

  async function login (postdata: MemberLoginUserInput) {
    try {
      const res = await api.post<MemberLoginResponse>('/service/API/Member/LoginAsync', new URLSearchParams({
        ['grant_type']: 'password',
        resolution: `${screen.width},${screen.height}`,
        userAgent: navigator.userAgent,
        deviceType: 'undefined',
        ...postdata
      }).toString(), {
        useRawResponseData: true,
        headers: { ['Content-Type']: 'application/x-www-form-urlencoded; charset=utf-8' }
      });

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
    const res = await api.get<ApiResponseData<MemberVIP>>('/service/API/MemberMyVIP/GetAsync');

    vip.value = res.data.Data;
  }

  async function fetchMember () {
    const res = await api.post<ApiResponseData<Member>>('/service/API/Member/GetAsync');

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

    const res = await api.post<ApiResponseData<{ Balance: string }>>('/service/API/Member/CreditAsync');

    await $balanceLoading.done(500);

    balance.value = numeral(res.data.Data.Balance).value() ?? 0;
  }

  async function takeAllMoneyBack () {
    const res = await api.post<ApiResponseData<unknown>>('/service/API/Member/AllPlatformTransferInMainAsync');

    $q.notify({
      message: res.data.Message
    });
  }

  function changeUserInfo (postdata: MemberEditPostdata) {
    return api.post('/service/API/Member/EditAsync', postdata);
  }

  function sendEmailVerifyCode (password: string, newEmail: string, oldEmail: string) {
    return api.post('/service/API/MemberSecurity/SendEmailVerifyCodeAsync', {
      Password: password,
      ['New_Email']: newEmail,
      ['Old_Email']: oldEmail
    });
  }

  /** */
  function verifyEmailCode (email: string, code: string) {
    return  api.post('/service/API/MemberSecurity/CheckVerifyEmailAsync', {
      Email: email,
      VerificationCode: code
    });
  }

  /** */
  function sendCellphoneVerifyCode (password: string, cellphone: string, isCheckDuplicate = 1, isNew = 1, isEdit = 0) {
    return api.post('/service/API/MemberSecurity/SendCellPhoneVerifyCodeAsync', {
      Password: password,
      CellPhone: cellphone,
      IsCheckDuplicate: isCheckDuplicate,
      IsNew: isNew,
      IsEdit: isEdit
    });
  }

  /** only for user without account name */
  function setAccountName (name: string) {
    if (member.value && member.value.Name) {
      throw new Error('Member got AccountName!');
    }

    return api.post('/service/API/Member/EditNameAsync', {
      Name: name
    });
  }

  /**  */
  function verifyCellphoneCode (cellphone: string, code: string) {
    return api.post('/service/API/MemberSecurity/VerifyCellPhoneAsync', {
      CellPhone: cellphone,
      VerificationCode: code
    });
  }

  /** Update account password */
  async function changePassword (oldPassword: string, newPassword: string) {
    const res = await api.post('/service/API/Member/ChangePasswordAsync', {
      OldPassword: encrypt(oldPassword),
      NewPassword: encrypt(newPassword)
    }, {
      error: {
        message: '修改密码失败！'
      }
    });

    return res;
  }

  /** Use password to create bankpassword. */
  async function addBankPassword (oldPassword: string, newBankPassword: string) {
    const res = await api.post('/service/API/MemberSecurity/AddBankPasswordAsync', {
      Password: encrypt(oldPassword),
      ['New_BankPassword']: encrypt(newBankPassword)
    }, {
      error: {
        message: '设置提款密码失败！'
      }
    });

    return res;
  }

  /** Use exists bank password to change it self. */
  async function changeBankPassword (oldBankPassword: string, newBankPassword: string) {
    const res = await api.post('/service/API/MemberSecurity/EditBankPasswordAsync', {
      ['Old_BankPassword']: encrypt(oldBankPassword),
      ['New_BankPassword']: encrypt(newBankPassword)
    }, {
      error: {
        message: '设置提款密码失败！'
      }
    });

    return res;
  }

  return {
    member,
    vip,
    balance,
    accessToken: $token.accessToken,
    refreshToken: $token.refreshToken,
    login,
    fetchInfo,
    fetchMyVIP,
    fetchBalance,
    setAccountName,
    takeAllMoneyBack,
    changeUserInfo,
    changePassword,
    addBankPassword,
    changeBankPassword,
    sendEmailVerifyCode,
    verifyEmailCode,
    sendCellphoneVerifyCode,
    verifyCellphoneCode
  };
});

function encrypt (password: string) {
  return btoa(decodeURI(encodeURIComponent(password)));
}

function loginErrorHandler (err: unknown) {
  if (!isApiAxiosError(err)) {
    return;
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