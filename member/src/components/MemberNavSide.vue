<script setup lang="ts">
import iconCoin from '@/assets/member/icon_coin.png';
import iconUser from '@/assets/member/icon_user.png';
import { MemberMenuEnum } from '@/const/menu.const';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="tw-max-w-[200px] tw-w-[30vw] tw-space-y-4">
    <div>
      <div class="tw-text-primary tw-text-lg tw-font-bold">
        <q-icon :name="`img:${iconCoin}`" size="sm" />
        资金管理
      </div>
      <ul class="tw-space-y-2 tw-py-4">
        <li>
          <q-btn class="nav-item" flat align="left">
            充值
          </q-btn>
        </li>
        <li>
          <q-btn class="nav-item" flat align="left">
            提款
          </q-btn>
        </li>
        <li>
          <q-btn class="nav-item" flat align="left">
            钱包转账
          </q-btn>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.TransactionRecord }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              交易记录
            </q-btn>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.BetRecord }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              投注记录
            </q-btn>
          </RouterLink>
        </li>
      </ul>
    </div>
    <div>
      <div class="tw-text-primary tw-text-lg tw-font-bold">
        <q-icon :name="`img:${iconUser}`" size="sm" />
        个人中心
      </div>
      <ul class="tw-space-y-2 tw-py-4">
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.UserInfo }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              信息设置
            </q-btn>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.SecuritySetting }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              安全管理
            </q-btn>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.WithdrawalAccounts }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              提款帐号管理
            </q-btn>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.MessagesList }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              消息中心
            </q-btn>
          </RouterLink>
        </li>
        <li>
          <RouterLink v-slot="{ navigate, isActive }" custom :to="{ name: MemberMenuEnum.MyVip }">
            <q-btn class="nav-item" :class="{ 'nav-item--active': isActive }" flat align="left" @click="navigate()">
              我的VIP
            </q-btn>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  @apply tw-w-full tw-bg-transparent tw-text-base tw-rounded-lg;

  &.nav-item--active,
  &:hover {
    @apply tw-bg-gradient-to-r tw-from-primary tw-to-primary-500 tw-text-white;
  }
}
</style>
