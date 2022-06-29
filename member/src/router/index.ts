import { isDev } from '@pork-buns/core/compositions/useEnv';
import BaseLayoutVue from '@/layouts/BaseLayout.vue';
import MemberPageLayoutVue from '@/layouts/MemberPageLayout.vue';
import { MemberMenuEnum } from '@/const/menu.const';
import { createRouter, createWebHistory } from 'vue-router';
import { TransactionDateTypeEnum, TransactionTypeEnum } from '@pork-buns/core/types/transactionRecord';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayoutVue,
      children: [
        {
          path: '',
          component: MemberPageLayoutVue,
          children: [
            // 錢包轉帳
            {
              path: 'transfer',
              name: MemberMenuEnum.Transfer,
              component: () => import('@/views/TransferView.vue')
            },
            // 资金管理
            {
              path: 'transaction-record',
              name: MemberMenuEnum.TransactionRecord,
              component: () => import('@/views/TransactionRecordView.vue'),
              redirect: { name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Deposit}`, params: { dayType: TransactionDateTypeEnum.Nearly7days } },
              children: [
                {
                  path: 'deposit/:dayType',
                  props: true,
                  name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Deposit}`,
                  component: () => import('@/components/transactionRecord/DepositRecords.vue')
                },
                {
                  path: 'withdrawal/:dayType',
                  props: true,
                  name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Withdrawals}`,
                  component: () => import('@/components/transactionRecord/WithdrawalRecords.vue')
                },
                {
                  path: 'transfer/:dayType',
                  props: true,
                  name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Transfer}`,
                  component: () => import('@/components/transactionRecord/TransferRecords.vue')
                },
                {
                  path: 'preferential/:dayType',
                  props: true,
                  name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Preferential}`,
                  component: () => import('@/components/transactionRecord/PreferentialRecords.vue')
                },
                {
                  path: 'others/:dayType',
                  props: true,
                  name: `${MemberMenuEnum.TransactionRecord}-${TransactionTypeEnum.Others}`,
                  component: () => import('@/components/transactionRecord/OthersRecords.vue')
                }
              ]
            },
            {
              path: 'bet-record',
              name: MemberMenuEnum.BetRecord,
              component: () => import('@/views/BetRecordView.vue')
            },
            // 个人中心
            {
              path: 'user-info',
              alias: '',
              name: MemberMenuEnum.UserInfo,
              component: () => import('@/views/UserInfoView.vue')
            },
            {
              path: 'security',
              name: MemberMenuEnum.SecuritySetting,
              component: () => import('@/views/SecuritySettingView.vue')
            },
            {
              path: 'withdrawals/accounts',
              name: MemberMenuEnum.WithdrawalAccounts,
              component: () => import('@/views/withdrawalAccounts/WithdrawalAccountsView.vue'),
              redirect: { name: MemberMenuEnum.WithdrawalAccounts$BankAccounts },
              children: [
                // 銀行帳戶管理
                {
                  path: 'banks',
                  name: MemberMenuEnum.WithdrawalAccounts$BankAccounts,
                  component: () => import ('@/views/withdrawalAccounts/BankAccountManageView.vue')
                },
                // 虛擬錢包管理
                {
                  path: 'cryptoWallets',
                  name: MemberMenuEnum.WithdrawalAccounts$CryptoWallets,
                  component: () => import ('@/views/withdrawalAccounts/CryptoWalletManageView.vue')
                }
              ]
            },
            {
              path: 'messages',
              name: MemberMenuEnum.MessagesList,
              component: () => import('@/views/MessagesListView.vue')
            },
            {
              path: 'my-vip',
              name: MemberMenuEnum.MyVip,
              component: () => import('@/views/MyVipView.vue')
            }
          ]
        }
      ]
    }
  ]
});

// mock login view
if (isDev()){
  router.addRoute({
    path: '/',
    component: BaseLayoutVue,
    children: [
      {
        path: '/dev-login',
        component: () => import('@/views/DevLoginView.vue')
      }
    ]
  });
}

export default router;
