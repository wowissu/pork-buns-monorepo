<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { RouterView } from 'vue-router';

console.log(getCurrentInstance());
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import '@/assets/base.scss';
</style>
