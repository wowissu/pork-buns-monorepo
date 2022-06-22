import { isDev } from '@/compositions/useEnv';
import BaseLayoutVue from '@/layouts/BaseLayout.vue';
import MemberPageLayoutVue from '@/layouts/MemberPageLayout.vue';
import { MenuEnum } from '@/const/menu.const';
import { createRouter, createWebHistory } from 'vue-router';

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
            {
              path: 'user-info',
              alias: '',
              name: MenuEnum.UserInfo,
              component: () => import('@/views/UserInfoView.vue')
            },
            {
              path: 'security',
              name: MenuEnum.SecuritySetting,
              component: () => import('@/views/SecuritySettingView.vue')
            },
            {
              path: 'withdrawals/accounts',
              name: MenuEnum.WithdrawalAccounts,
              component: () => import('@/views/withdrawalAccounts/WithdrawalAccountsView.vue'),
              redirect: { name: MenuEnum.WithdrawalAccounts$BankAccounts },
              children: [
                // 銀行帳戶管理
                {
                  path: 'banks',
                  name: MenuEnum.WithdrawalAccounts$BankAccounts,
                  component: () => import ('@/views/withdrawalAccounts/BankAccountManageView.vue')
                },
                // 虛擬錢包管理
                {
                  path: 'cryptoWallets',
                  name: MenuEnum.WithdrawalAccounts$CryptoWallets,
                  component: () => import ('@/views/withdrawalAccounts/CryptoWalletManageView.vue')
                }
              ]
            },
            {
              path: 'messages',
              name: MenuEnum.MessagesList,
              component: () => import('@/views/MessagesListView.vue')
            },
            {
              path: 'myvip',
              name: MenuEnum.MyVip,
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
