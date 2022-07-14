<template>
  <q-layout view="hHh Lpr fFf">
    <q-header>
      <q-toolbar class="bg-white tw-flex tw-flex-col tw-justify-start tw-items-start">
        <div class="tw-flex tw-justify-start tw-mt-3">
          <div class="tw-flex-1  tw-flex tw-flex-row tw-justify-start tw-items-start">
            <q-icon name="mdi-format-align-justify" size="sm" class="logo_icon" @click="toggleLeftDrawer" />
            <img :src="logo" class="logo">
          </div>
          <div class=" tw-flex-1 tw-w-32   tw-flex tw-flex-row tw-justify-end tw-items-end tw-text-amber-900">
            <div
              class="loginButton"
            >
              登录
            </div>
            <div
              class="loginButton"
            >
              注册
            </div>
          </div>
        </div>
        <Header style="width:100%" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" elevated :width="drawerWidths">
      <SideBar @closeMenu="closeMenu"/>
    </q-drawer>
    <q-page-container>
      <slot>
        <router-view />
      </slot>
    </q-page-container>
    <q-footer class="bg-white">
      <BottomBar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BottomBar from '@/components/common/BottomBar.vue';
import SideBar from '@/components/common/SideBar.vue';
import Header from '@/components/common/Header.vue';
import logo from '@/assets/header/logo.png';

const winW = document.body.clientWidth;
const drawerWidths = ref<number>(500);

drawerWidths.value = (winW / 5 * 2);
const leftDrawerOpen = ref<boolean>(false);

const closeMenu = () =>{
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

</script>

<style lang="scss" scoped>
.logo{
  float: left;
  width: 50%;
  margin-top: 3%;
}
.logo_icon{
  color:#c70303;
  margin-top: 3%;
  margin-right: 3%;
}
.loginButton{
  background: url(@/assets/header/btn_submenu.png) no-repeat;
  display: inline-block;
  width: 35.5%;
  background-size: 100%;
  text-align: center;
  color: #883a1b;
  font-size: 3.5vw;
  line-height: 1.8rem;
}
</style>
