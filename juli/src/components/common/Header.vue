<template>
  <div>
    <div class="header_coneten">
      <!-- <mLogin :current="currentlogin" :promo-login="promoLogin" /> -->
      <div style="width: 100%">
        <div class="mSubheader">
          <span
            v-for="(item,index) in headTitle"
            :key="index"
            class="mSubheaderItem"
            :class="{ headItem: categoryindex == index+1 }"
            @click="categoryclick(item.gameTypeId)"
          >{{ item.cName }}
            <q-icon name="mdi-chevron-down" size="xs" />
          </span>
        </div>
      </div>
      <div v-show="mSubmenu" class="msubheaderBar">
        <img
          v-show="menuData.length>3"
          :src="btn_submenu_page_l"
          class="leftclick pageChange2"
          @click="prePage"
        >
        <div v-for="(item,index) in showMenuData " v-show="mSubmenu" :key="index" class="mPopup">
          <div
            class="dataItem"
            :style="{ backgroundImage: `url(${getUrl(item.PlatformEName)})` }"
          >
            <!-- @click="getgameasync(item)" -->
            <div class="Mmenu_box_bg">
              <p class="Msub_menu_title tw-mb-2" :class="{'tw-mr-4': menuData.length>3}">
                <span style="color:white;">{{ item.CName }}</span>
              </p>
            </div>
          </div>
        </div>
        <img
          v-show="menuData.length>3"
          :src="btn_submenu_page_r"
          class="leftclick pageChange2"
          @click="nextPage"
        >
      </div>
    </div>
    <div v-show="showMask" class="mask" :class="{'active': showMask}" @click="closeModal" />

    <!-- <div class="favorfather">
      <el-dialog v-model:visible="walletshow" class="walletdialog" :close-on-click-modal="false">
        <div style="text-align: center">
          <span
            style="
              color: rgb(199, 3, 3);
              text-align: center;
              font-size: 27px;
              position: absolute;
              left: 0px;
              right: 0px;
              top: -25px;
              background: rgb(240, 240, 240);
              width: 251px;
              box-shadow: rgb(136 136 136) 0px 1px 3px 1px;
              line-height: 42px;
              padding: 10px 0px 0px;
              font-weight: bold;
              margin: auto;
              height: 46px;
              border-radius: 30px;
            "
          >
            快速转账
          </span>
        </div>
        <div
          style="
            padding-top: 75px;
            text-align: center;
            width: 100%;
            height: 100px;
          "
        >
          <div class="walletleft">
            <img src="../../assets/popup_trans_icon01.png">
            <span>中心钱包余额</span>
            <div class="walletleftcurrent">
              {{ current2 }}
            </div>
            <el-button
              style="
                background: #f26d6d;
                cursor: pointer;
                padding: 6px 17px;
                border-radius: 50px;
              "
              @click="deposit"
            >
              <span style="color: white; size: 16px">充值</span>
            </el-button>
          </div>
          <img
            src="../../assets/popup_trans_switch.png"
            style="float: left; margin-top: 24px"
          >
          <div class="walletleft">
            <img src="../../assets/popup_trans_icon02.png">
            <span>当前游戏账户金额</span>
            <div class="walletleftcurrent">
              {{ current }}
            </div>
          </div>
        </div>
        <div class="transferclass">
          <span>请输入转账金额</span>
          <span
            style="
              color: #898989;
              margin-right: 90px;
              cursor: pointer;
              float: right;
            "
            @click="toall"
          >全部</span>
          <el-input
            v-model="amount"
            oninput="value=parseInt(value.replace(/[^\d]/g,''))"
            type="number"
            placeholder="请输入转账金额"
            style="margin-top: 15px"
            class="submitformlist"
          />
        </div>

        <div
          style="
            text-align: center;
            margin-right: 0px;
            margin-top: 10px;
            padding-bottom: 10px;
          "
          class="livebox"
        >
          <el-button
            type="warning"
            size="medium"
            round
            style="
              margin-top: 25px;
              margin-bottom: 35px;
              background: white;
              color: #898989;
              border: #898989;
              margin-right: 10%;
              border-radius: 50px;
              width: 190px;
              height: 47px;
              font-size: 18px;
              box-shadow: 0px 1px 3px 1px;
            "
            @click="withdraw"
          >
            一键转回中心钱包
          </el-button>
          <el-button
            type="warning"
            size="medium"
            round
            style="
              margin-top: 20px;
              margin: auto;
              width: 190px;
              height: 47px;
              border-radius: 50px;
              font-size: 18px;
              box-shadow: 0px 1px 3px 1px;
            "
            @click="togame"
          >
            转账并进入游戏
          </el-button>
          <span
            style="
              cursor: pointer;
              line-height: 40px;
              color: #898989;
              text-align: center;
              background: white;
              display: block;
              font-size: 16px;
              margin-bottom: -10px;
              border-radius: 0px 0px 10px 10px;
            "
            @click="togame2"
          >
            忽略提醒并进入游戏
          </span>
        </div>
      </el-dialog>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ApiResponseData } from '@pork-buns/core/types/api';
import { useApi } from '@/plugins/memberApi.plugin';
import btn_submenu_page_l from '@/assets/header/btn_submenu_page_l.png';
import btn_submenu_page_r from '@/assets/header/btn_submenu_page_r.png';

const showMask = ref<boolean>(false);
const categoryindex = ref<number|string>(0);
const mSubmenu = ref<boolean>(false);
const menuPage = ref<number>(0);
const headTitle = ref<{[propsNaume: string]: string| number}[]>([
  {
    gameTypeId: 1,
    cName: '电子'
  },
  {
    gameTypeId: 2,
    cName: '真人'
  },
  {
    gameTypeId: 3,
    cName: '彩票'
  },
  {
    gameTypeId: 4,
    cName: '体育'
  },
  {
    gameTypeId: 5,
    cName: '电竞'
  },
  {
    gameTypeId: 6,
    cName: '棋牌'
  },
  {
    gameTypeId: 7,
    cName: '捕鱼'
  }
]);
const gameData = ref<{ [propName: string]: any}[]>([]);
const menuData = ref<{ [propName: string]: any}[]>([]);
const showMenuData = ref<{ [propName: string]: any}[]>([]);
const api = useApi();

onMounted(async ()=>{
  const res = await api.get<ApiResponseData<{[propName: string]: any}>>('/service/api/Game/GameUIAsync', {
  });

  gameData.value =  res.data.Data.Game;
});
const prePage = function () {
  if ((menuPage.value - 1) * 3 >= 0) {
    menuPage.value--;

    showMenuData.value = menuData.value.slice(menuPage.value * 3, (3 * (menuPage.value + 1)));
  }
};
const nextPage = function () {
  if ((menuPage.value + 1) * 3 < menuData.value.length) {
    menuPage.value++;

    showMenuData.value = menuData.value.slice(menuPage.value * 3, (3 * (menuPage.value + 1)));
    const tempLength = showMenuData.value.length;

    if (showMenuData.value.length !== 3) {
      for (let i = 0; i < (3 - tempLength); i++) {
        showMenuData.value.push({});
      }
    }
  }
};
const getUrl = function (PlatformEName: string): string {
  if (PlatformEName === '0') {
    return `../../src/assets/header/${PlatformEName}_h.png`;
    // return require('../../mobile_pics/' + PlatformEName + '_h' + '.png');
  } else {
    return `../../src/assets/header/${PlatformEName}.png`;
    // return require('../../mobile_pics/' + PlatformEName + '.png');
  }
};
const closeModal = function (){
  showMask.value = false;
  mSubmenu.value = !mSubmenu.value;
  categoryindex.value = 0;
};
const  categoryclick = function (gameTypeId :number|string) {
  menuPage.value = 0;
  showMask.value = true;
  categoryindex.value = gameTypeId;
  menuData.value = gameData.value.filter(item => {
    if (item.GameTypeID === gameTypeId){
      return item;
    }
  });

  if (menuData.value.length > 3){
    showMenuData.value = menuData.value.slice(menuPage.value * 3, 3);
  } else {
    showMenuData.value = menuData.value;
  }

  console.log(menuData.value);
  mSubmenu.value = true;
};

</script>

<style lang="scss" scoped>
.header_coneten{
  line-height: 52px;

}
.mSubheader{
  width: auto;
  overflow-x: auto;
  white-space: nowrap;
  font-size:3vw;
  display: block;
}
.mSubheaderItem{
  color:#898989;
  margin: 0% 3%;
}
.msubheaderBar{
  display: flex;
  justify-content: space-around;
  height:160px;
  top: 5rem;
  left:0px;
  position: fixed;
  z-index: 999;
  width: 100%;
  background:#fff;
}

.mPopup{
  width: 33%;
  left: 0 !important;
  background: white;
  z-index: 999;
  animation: elheaderAnim 0.9s;
  text-align: center;
  margin-left:1%;
  margin-top:1%;
}
.dataItem{
  float: left;
  width: 100%;
  height: 125px;
  background-size: 100% 100%!important;
  background:no-repeat;
}
.Mmenu_box_bg {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  bottom: 7.5%;
  width: 33%;
}
.Msub_menu_title {
  text-align: center;
  font-size: 2.5vw;
}
.leftclick {
  cursor: pointer;
  height: 35px;
  width: 27px;
  margin-top: 34px;
}
.headItem{
  color:#c70303;
}
.mask{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  position: fixed;
  left: 0;
  top: 5rem;
  opacity: 0;
  transform: scale(0);
  transition: ease opacity 0.3s, ease transform 0s 0.3s;
  z-index: 990;
  &.active {
    opacity: 1;
    transform: scale(1);
    transition: ease opacity 0.3s, ease transform 0s;
  }
}
</style>
