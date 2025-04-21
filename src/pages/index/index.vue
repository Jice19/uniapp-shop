<script setup lang="ts">
//导入组件
import topBar from './components/topBar.vue'
import XtxSwiper from '@/components/XtxSwiper .vue'
import XtxGuess from '@/components/XtxGuess.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
// 导入配置
import { onLoad } from '@dcloudio/uni-app'
import {getHomeBannerApi,getHomeCategoryAPI,getHomeHotAPI} from '@/services/home'
import { ref } from 'vue'
import type {  HotItem, BannerItem, CategoryItem } from '@/types/home'
import type { XtxGuessInstance } from '@/types/component'
import { useGuessList } from '@/composables'

// 轮播图板块  开始
const bannerList = ref<BannerItem[]>([])
const getHomeData = async () => {
  const res = await getHomeBannerApi()
  bannerList.value = res.result
}

onLoad (()=>{
  getHomeData()
})
// 轮播图板块 结束

// 主页分类板块 开始
const CategoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  CategoryList.value = res.result
}

onLoad (()=>{
  getHomeCategoryData()
})
// 主页分类板块结束`

// 主页热门推荐 开始
const HotList = ref<HotItem[]>([])
const getHotData = async () => {
  const res = await getHomeHotAPI()
  // console.log(res);
  HotList.value = res.result
}

onLoad (()=>{
  getHotData()
})
// 主页热门推荐 结束

// 使用封装的hooks组合式函数实现分页加载
const { guessRef  , onScrolltolower} = useGuessList()


// 自定义下拉刷新
const isTrigger = ref(false)
const onRefresherrefresh = async() => {
  isTrigger.value = true
  // 重置数据
  guessRef.value?.resetData()
  await Promise.all([ getHomeData(),getHomeCategoryData(),getHotData(),guessRef.value?.getMore()])
  isTrigger.value = false
}
</script>

<template>
  <view class="index">
    <!-- 导航栏 -->
  <topBar></topBar>
  <scroll-view refresher-enabled @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTrigger" @scrolltolower="onScrolltolower" class="scroll-view" scroll-y>
    <!-- 轮播图 -->
  <XtxSwiper :list="bannerList"></XtxSwiper>
  <!-- 分类 -->
  <CategoryPanel :list="CategoryList"></CategoryPanel>
  <!-- 热门推荐 -->
  <HotPanel :list="HotList"></HotPanel>
  <!-- 猜你喜欢 -->
  <XtxGuess ref="guessRef"></XtxGuess>
  </scroll-view>

  </view>
</template>

<style lang="scss">
page{
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
}
.scroll-view{
  flex:1;
}
</style>
