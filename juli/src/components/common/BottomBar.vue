<template>
  <div v-for="(item, index) in picsList" :key="index" class="mBottomItem">
    <div class="mBottomItem_item" :style="{ backgroundImage: `url(${getUrl(item)})` }" @click="itemClick(item,index)">
      <span :style="{ color: `${getColor(item)}` }">{{ item.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type picsListinterface = {
  index: number,
  active: boolean,
  name: string,
  name2: string,
  title: string,
  color: string,
  color2: string
};

const picsList = ref<picsListinterface[]>([
  { index: 0, active: false, 'name': 'icon_footerm01', 'name2': 'icon_footerm01_ing', 'title': '首页', 'color': '#626262', 'color2': '#d9a566' },
  { index: 1, active: false, 'name': 'icon_footerm02', 'name2': 'icon_footerm2_ing', 'title': '体育', 'color': '#626262', 'color2': '#d9a566' },
  { index: 2, active: false, 'name': 'icon_footerm03', 'name2': 'icon_footerm03_ing', 'title': '客服', 'color': '#626262', 'color2': '#d9a566' },
  { index: 3, active: false, 'name': 'icon_footerm04', 'name2': 'icon_footerm04_ing', 'title': '优惠', 'color': '#626262', 'color2': '#d9a566' },
  { index: 4, active: false, 'name': 'icon_footerm05', 'name2': 'icon_footerm05_ing', 'title': '我的', 'color': '#626262', 'color2': '#d9a566' }]);
const getColor = (item: picsListinterface) => {
  if (item){
    return (item.active ? item.color2 : item.color);
  }
};
const itemClick = (item:picsListinterface, index: number) => {
  picsList.value = picsList.value.map((element:any) => {
    if (element.index !== index){
      element.active = false;
    } else {
      element.active = true;
    }

    return element;
  });
  // tempName = item.name;
  // item.name = item.name2;
  // item.name2 = tempName;
  // tempColor = item.color;
  // item.color = item.color2;
  // item.color2 = tempColor;
};
const getUrl = (item: picsListinterface) => {
  return item.active ? '../../src/assets/home/' + item.name2 + '.png' : '../../src/assets/home/' + item.name + '.png';
};

</script>

<style scoped>
.mBottomList{
  padding-bottom:1%;
  position: fixed;
  width:100%;
  bottom:0px;
  background:#FAFAFA;
}
.mBottomItem{
  text-align: center;
  display: inline-block;
  position: relative;
  width:20%;
}
.mBottomItem img{
  width:88%;
}
.mBottomItem_item{
  height: 70px;
  background:no-repeat;
  background-size: 100%;
}
.mBottomItem_item span{
  position: absolute;
  font-size:2vw;
  left:35%;
  bottom:5px;
}
</style>