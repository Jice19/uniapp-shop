//封装请求轮播图数据请求
import type{ BannerItem } from "@/types/home";
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