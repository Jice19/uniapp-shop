//封装请求轮播图数据请求
import type { PageResult } from "@/types/global";
import type{ BannerItem,CategoryItem, GuessItem, HotItem } from "@/types/home";
import {http} from '@/utils/http'
/*
*首页 广告区域 轮播图
*@param distributionSite 投放位置 1为首页  2为分类页
*/

export const getHomeBannerApi = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method : 'GET',
    url : '/home/banner',
    data : {
      distributionSite
    }
  })
}


/**
 * 首页-前台分类-小程序
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli'
  })
}

/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = () => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
  })
}