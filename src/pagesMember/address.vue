<script setup lang="ts">
import { deleteMemberAddressByIdAPI, getMemberAddressAPI } from '@/services/address';
import { useAddressStore } from '@/stores/modules/adress';
import type { AddressItem } from '@/types/goods';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';

//获取用户数据
const memberList = ref<AddressItem[]>([])
const getMemberAddressData = async () => {
  const res = await getMemberAddressAPI()
  // console.log(res);
  memberList.value = res.result
}

onLoad(() => {
  getMemberAddressData()
})

onShow(() => {
  // 监听自定义事件
  const eventListener = (): void => {
    getMemberAddressData()
  }
  uni.$on('addressUpdated', eventListener)

  // 为了避免多次监听导致多次执行数据获取操作，
  // 在页面卸载时（例如页面切换到后台等情况）移除监听器
  // 这里可以使用 onUnmounted 钩子函数来实现，不过在 setup 语法糖中，
  // 可以通过在 onShow 中保存监听器函数并在合适时机移除
  // 这里先简单处理，在实际项目中可以根据需求完善
  // 注意：如果页面被销毁再重建，需要重新添加监听器
  // 这里只是简单示例，保证在当前页面显示期间监听事件
})

// 删除事件
const deleteMemberByid = (id : string) => {
  // 弹窗二次确认
  uni.showModal({
    content:'确认删除地址？',
     success:(res)=>{
      if(res.confirm) {
         deleteMemberAddressByIdAPI(id)
        // 获取最新数据
        getMemberAddressData()
      }
    },
  })
}

// 修改收货地址
const onChangeAddress = (item: AddressItem) => {
  // 修改选中收货地址
  const addressStore = useAddressStore()
  addressStore.changeSelectedAddress(item)
  // 返回上一页
  uni.navigateBack()
}
</script>

<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view class="scroll-view" scroll-y>
      <view v-if="memberList.length" class="address">
        <uni-swipe-action class="address-list">
          <!-- 收货地址项 -->
          <uni-swipe-action-item class="item" v-for="item in memberList" :key="item.id">
            <view class="item-content" @tap="onChangeAddress(item)">
              <view class="user">
                {{ item.receiver }}
                <text class="contact">{{ item.contact }}</text>
                <text v-if="item.isDefault" class="badge">默认</text>
              </view>
              <view class="locate">{{ item.fullLocation }} {{ item.address }}</view>
              <navigator
                class="edit"
                hover-class="none"
                :url="`/pagesMember/address-form?id=${item.id}`"
                 @tap.stop="() => {}" 
              >
                修改
              </navigator>
            </view>
            <template #right>
              <button @tap="deleteMemberByid(item.id)" class="delete-button">删除</button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pagesMember/address-form">
        新建地址
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

/* 删除按钮 */
.delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 0;
  padding: 0;
  background-color: #cf4444;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;

  .scroll-view {
    padding-top: 20rpx;
  }
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item-content {
    line-height: 1;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }

  .item:last-child .item-content {
    border: none;
  }

  .user {
    font-size: 28rpx;
    margin-bottom: 20rpx;
    color: #333;

    .contact {
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 4rpx 10rpx 2rpx 14rpx;
      margin: 2rpx 0 0 10rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border-radius: 6rpx;
      border: 1rpx solid #27ba9b;
    }
  }

  .locate {
    line-height: 1.6;
    font-size: 26rpx;
    color: #333;
  }
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>