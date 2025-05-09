// src/pages/goods/goods.vue
<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 接收传送过来的id
const query = defineProps<{
  id : string
}>()
// console.log(query);

// 调用请求数据的函数
import { getDataByIdApi } from '@/services/goods';
import type { GoodsResult } from '@/types/goods';
import { onLoad } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
// 声明商品存储
const goods = ref<GoodsResult>()
const getDateByid = async() => {
  const res = await getDataByIdApi(query.id)
  goods.value = res.result
  // SKU组件所需格式
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((v) => ({ name: v.name, list: v.values })),
    sku_list: res.result.skus.map((v) => ({
      _id: v.id,
      goods_id: res.result.id,
      goods_name: res.result.name,
      image: v.picture,
      price: v.price * 100, // 注意：需要乘以 100
      stock: v.inventory,
      sku_name_arr: v.specs.map((vv) => vv.valueName),
    })),
  }
}

// sku组件相关
// 是否显示SKU组件
const isShowSku = ref(false)
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)
// 按钮模式
enum Skumode {
  Both=1,
  Cart=2,
  Buy=3,
}
// 点击选择模式
const mode = ref<Skumode>(Skumode.Both)
const openSkuPopup = (val:Skumode) => {
  isShowSku.value = true ,
  mode.value = val
}

// 页面加载时调用函数
onLoad (() => {
  getDateByid()
})

// 轮播图
// 轮播图变化时
// 当前图片index
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current
}

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: goods.value!.mainPictures,
  })
}
// 轮播图结束

// 弹出弹窗Adress和Service
import AddressPanel from '@/components/AdressPanel.vue'
import ServicePanel from '@/components/servicePanel.vue'
import { SkuPopupInstance, type SkuPopupEvent, type SkuPopupLocaldata } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup';
import { postMemberCartAPI } from '@/services/cart';

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'address' | 'service'>()
const openPopup = (name: typeof popupName.value) => {
  // 修改弹出层名称
  popupName.value = name
  // 打开弹出层
  popup.value?.open()
}

// // 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

// 实现加入购物车： 通过sku组件的Add-cart事件实现
const OnaddCart = async(ev: SkuPopupEvent) => {
  await postMemberCartAPI({skuId:ev._id,  count:ev.buy_num})
  uni.showToast({icon:'success',title:'添加成功'})
  isShowSku.value = false
}

// 计算选中属性
const skupopupRef = ref<SkuPopupInstance>()
const selectData = computed(() => {
  return skupopupRef?.value?.selectArr.join(' ').trim() || '请选择商品规格'
})

// sku立即购买事件
const onBuyNow = async (ev:SkuPopupEvent) => {
  // 跳转页面并传参
  uni.navigateTo({url:`/pageorder/create?skuId=${ev._id}&count =${ev.buy_num}`})
  // 关闭sku组件
  isShowSku.value=false
}
</script>

<template>
  <vk-data-goods-sku-popup
  :localdata="localdata"
  v-model="isShowSku"
  :mode="mode"
  ref="skupopupRef"
  @add-cart="OnaddCart"
  @buy-now="onBuyNow"
  ></vk-data-goods-sku-popup>

  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
       <!-- 商品主图 -->
        <view class="preview">
          <swiper @change="onChange" circular>
            <swiper-item v-for="item in goods?.mainPictures" :key="item">
              <image @tap="onTapImage(item)" mode="aspectFill" :src="item" />
            </swiper-item>
          </swiper>
          <view class="indicator">
            <text class="current">{{ currentIndex + 1 }}</text>
            <text class="split">/</text>
            <text class="total">{{ goods?.mainPictures.length }}</text>
          </view>
        </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goods?.name }} </view>
        <view class="desc"> {{ goods?.desc }} </view>
      </view>


        <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="openSkuPopup(Skumode.Both)">
          <text class="label">选择</text>
          <text class="text ellipsis"> 请选择商品规格 </text>
        </view>
        <view @tap="openPopup('address')" class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis"> 请选择收获地址 </text>
        </view>
        <view @tap="openPopup('service')" class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
  </view>
    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goods?.details.properties" :key="item.name">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{item.value}}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
        v-for="item in goods?.details.pictures" :key="item"
          mode="widthFix"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goods?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${goods?.id}`"
        >
          <image
            class="image"
            mode="aspectFill"
            :src="item.picture"
          ></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cart2">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="openSkuPopup(Skumode.Cart)"> 加入购物车 </view>
      <view class="buynow" @tap="openSkuPopup(Skumode.Buy)"> 立即购买 </view>
    </view>
  </view>

  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
        <AddressPanel v-if="popupName === 'address'" @close="popup?.close()" />
        <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>

</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 750rpx;
    position: relative;
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }
}
.goods .action {
  padding-left: 20rpx;
  .item {
    height: 90rpx;
    padding-right: 60rpx;
    border-bottom: 1rpx solid #eaeaea;
    font-size: 26rpx;
    color: #333;
    position: relative;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: 0 none;
    }
  }
  .label {
    width: 60rpx;
    color: #898b94;
    margin: 0 16rpx 0 10rpx;
  }
  .text {
    flex: 1;
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  padding-left: 20rpx;
  .content {
    padding: 0 20rpx 20rpx;
    margin-left: -20rpx;
    background-color: #f4f4f4;
    overflow: hidden;
    navigator {
      width: 345rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 20rpx 0 0;
      border-radius: 10rpx;
      background-color: #fff;
      float: left;
    }
    .image {
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }
    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }
  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>