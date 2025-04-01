<script setup lang="ts">
import topBar from './components/topBar.vue'
import XtxSwiper from '@/components/XtxSwiper .vue'
import { onLoad } from '@dcloudio/uni-app'
import {getHomeBannerApi} from '@/services/home'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])
const getHomeData = async () => {
  const res = await getHomeBannerApi()
  bannerList.value = res.result
}

onLoad (()=>{
  getHomeData()
})
</script>

<template>
  <view class="index">
  <topBar></topBar>
  <XtxSwiper :list="bannerList"></XtxSwiper>
  </view>
</template>

<style lang="scss">
//
</style>
