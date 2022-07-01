<template>
  <div class="close" @click="closeMenu">
    <span style="color:#c70303">x</span>
  </div>
  <div class="mbg_side">
    <div class="mbg_side_content" style="margin-top:19%">
      <img :src="icon_m01">
      <span>优惠活动</span>
    </div>
    <div class="mbg_side_content" style="margin-top:1%">
      <img :src="icon_m02">
      <span>VIP福利</span>
    </div>
    <div class="mbg_side_content" style="margin-top:1%">
      <img :src="icon_m04">
      <span>合营计划</span>
    </div>
    <div class="mbg_side_content" style="margin-top:1%">
      <img :src="icon_m05">
      <span>聚力赞助</span>
    </div>
    <div class="divides" />
    <div class="mbg_side_content" style="margin-top:8%">
      <span style="color:#898989;margin-left:2%">帮助中心</span>
    </div>
    <div class="mbg_side_content" style="margin-top:0%">
      <span style="color:#898989;margin-left:2%">线路检测</span>
    </div>
    <div class="mbg_side_content" style="margin-top:0%">
      <span style="color:#898989;margin-left:2%">关于我们</span>
    </div>
    <div class="mbg_side_content" style="margin-top:0%">
      <span style="color:#898989;margin-left:2%">博彩责任</span>
    </div>
    <div class="mbg_side_content" style="margin-top:0%">
      <span style="color:#898989;margin-left:2%">规则与条款</span>
    </div>
    <div class="mbg_side_content" style="margin-top:0%">
      <span style="color:#898989;margin-left:2%">官媒清单</span>
    </div>
    <div class="mlogin_regist">
      登录 / 注册
    </div>
  </div>
</template>

<script setup lang="ts">
import icon_m01 from '@/assets/header/icon_m01.png';
import icon_m02 from '@/assets/header/icon_m02.png';
import icon_m04 from '@/assets/header/icon_m04.png';
import icon_m05 from '@/assets/header/icon_m05.png';

const emit = defineEmits(['closeMenu']);

const closeMenu = function (){
  emit('closeMenu');
};

</script>

<style lang="scss" scoped>
.close{
  margin: 0.5rem 1rem;
  text-align: right;
  font-size: 18px;
  color: #909399;
  cursor: pointer;
  z-index: 2100;
}
.mbg_side{
  position: fixed;
  left: 0;
  top: 3%;
  width: 100%;
  bottom: 0;

}
.mbg_side_content{
  margin-left:10%;
  margin-top:22%;
  height:7%;
  display: block;
}

.mbg_side img{
  float: left;
  width: 17%;
  margin-right:2%;
  margin-top: 1%;
}
.mbg_side span{
  display: inline-block;
  color:black;
  font-weight: bold;
  font-size:3vw;
}
.mlogin_regist{
  border: 1px solid #e77a79;
  border-radius: 16px;
  font-size: 3vw;
  width: 51%;
  line-height: 25px;
  padding: 0 4%;
  margin-left: 17%;
  text-align: center;
  color: #e77a79;
  position: absolute;
  bottom: 5%;
}
.divides{
  border-bottom: 1px solid #c2c2c2;
  width: 20%;
  margin-left: 10%;
  margin-top: 15%;
  margin-bottom: 10%;
}
</style>