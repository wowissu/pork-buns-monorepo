import type { ApiResponseData } from '../types/api';
import type { Member, MemberEditPostdata, MemberLoginResponse, MemberLoginUserInput, MemberVIP } from '../types/member';
import { defineStore } from 'pinia';
import { useApi } from '../plugins/api.plugin';
import type { ApiVIPLevel, VIPPrivilege } from '../types/vip';
import type { AddBankAccountPostdata, BankAcount } from '../types/bank';
import type { AddCryptoWalletPostdata, CryptoWallet } from '../types/crypto';

export const useMemberApi = defineStore('memberApi', () => {
  const api = useApi();

  return {
    // fetch
    fetchVip: () => api.get<ApiResponseData<MemberVIP>>('/service/API/MemberMyVIP/GetAsync'),
    fetchMember: () => api.post<ApiResponseData<Member>>('/service/API/Member/GetAsync'),
    fetchBalance: () => api.post<ApiResponseData<{ Balance: string }>>('/service/API/Member/CreditAsync'),
    // put
    changeName: (name: string) => api.post('/service/API/Member/EditNameAsync', { Name: name }),
    changeUserInfo: (postdata: MemberEditPostdata) => api.post('/service/API/Member/EditAsync', postdata),
    changePassword: (oldPassword: string, newPassword: string) => api.post('/service/API/Member/ChangePasswordAsync', { OldPassword: encrypt(oldPassword), NewPassword: encrypt(newPassword) }, { overrideError: { message: '修改密码失败！' } }),
    // actions
    takeAllBack: () => api.post<ApiResponseData<unknown>>('/service/API/Member/AllPlatformTransferInMainAsync'),
    login: (postdata: MemberLoginUserInput) => {
      return api.post<MemberLoginResponse>('/service/API/Member/LoginAsync', new URLSearchParams({
        ['grant_type']: 'password',
        resolution: `${screen.width},${screen.height}`,
        userAgent: navigator.userAgent,
        deviceType: 'undefined',
        ...postdata
      }).toString(), {
        useRawResponseData: true,
        headers: { ['Content-Type']: 'application/x-www-form-urlencoded; charset=utf-8' }
      });
    }
  };
});

/** vip system */
export const useVipApi = defineStore('vipApi', () => {
  const api = useApi();

  return {
    // fetch
    fetchVipSystem: () => api.get<ApiResponseData<{ VipPrivileges: VIPPrivilege[], Vipsystem: ApiVIPLevel[] }>>('service/API/System/GetAsync')
  };
});

/** member withdrawal */
export const useWithdrawalAccountApi = defineStore('withdrawalAccountApi', () => {
  const api = useApi();

  return {
    // bank
    fetchBankAccountList: () => api.post<ApiResponseData<BankAcount[]>>('service/API/MemberWithdrawBank/ListAsync'),
    verifyBeforeAddBankAccount: (password: string, bankPassword: string) => api.post('service/API/MemberWithdrawBank/AddValidateAsync', { Password: password, BankPassword: bankPassword }),
    addBankAccount: (postdata: AddBankAccountPostdata) => api.post('service/API/MemberWithdrawBank/AddAsync', postdata),

    // crypto
    fetchCryptoWalletList: () => api.post<ApiResponseData<CryptoWallet[]>>('service/API/MemberWithdrawUsdt/ListAsync'),
    verifyBeforeAddCryptoWallet: (password: string, bankPassword: string) => api.post('service/API/MemberWithdrawUsdt/AddValidateAsync', { Password: password, BankPassword: bankPassword }),
    addCryptoWallet: (postdata: AddCryptoWalletPostdata) => api.post('service/API/MemberWithdrawBank/AddAsync', postdata)
  };
});

export const useMemberSecurityApi = defineStore('memberSecurityApi', () => {
  const api = useApi();

  return {
    sendEmailVerifyCode (password: string, newEmail: string, oldEmail: string) {
      return api.post('/service/API/MemberSecurity/SendEmailVerifyCodeAsync', {
        Password: password,
        ['New_Email']: newEmail,
        ['Old_Email']: oldEmail
      });
    },

    verifyEmailCode (email: string, code: string) {
      return  api.post('/service/API/MemberSecurity/CheckVerifyEmailAsync', {
        Email: email,
        VerificationCode: code
      });
    },

    sendCellphoneVerifyCode (password: string, cellphone: string, isCheckDuplicate = 1, isNew = 1, isEdit = 0) {
      return api.post('/service/API/MemberSecurity/SendCellPhoneVerifyCodeAsync', {
        Password: password,
        CellPhone: cellphone,
        IsCheckDuplicate: isCheckDuplicate,
        IsNew: isNew,
        IsEdit: isEdit
      });
    },

    verifyCellphoneCode (cellphone: string, code: string) {
      return api.post('/service/API/MemberSecurity/VerifyCellPhoneAsync', {
        CellPhone: cellphone,
        VerificationCode: code
      });
    },

    /** Use password to create bankpassword. */
    addBankPassword (oldPassword: string, newBankPassword: string) {
      return api.post('/service/API/MemberSecurity/AddBankPasswordAsync', {
        Password: encrypt(oldPassword),
        ['New_BankPassword']: encrypt(newBankPassword)
      }, {
        overrideError: {
          message: '设置提款密码失败！'
        }
      });
    },

    /** Use exists bank password to change it self. */
    changeBankPassword (oldBankPassword: string, newBankPassword: string) {
      return api.post('/service/API/MemberSecurity/EditBankPasswordAsync', {
        ['Old_BankPassword']: encrypt(oldBankPassword),
        ['New_BankPassword']: encrypt(newBankPassword)
      }, {
        overrideError: {
          message: '设置提款密码失败！'
        }
      });
    }
  };
});

function encrypt (password: string) {
  return btoa(decodeURI(encodeURIComponent(password)));
}