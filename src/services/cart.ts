import type { CartItem } from "@/types/cart"
import { http } from "@/utils/http"

// 封装加入购物车api
export const postMemberCartAPI = (data:{skuId:string, count : number}) => {
  return http({
    method:"POST",
    url:"/member/cart",
    data
  })
}

// 获取请求用户仓库数据
/**
 * 获取购物车列表
 */
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })
}