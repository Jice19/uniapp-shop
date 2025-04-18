// 首页广告轮播图的请求数据的类型
export type BannerItem = {
  // 跳转连接
  herfUrl : string
  // id
  id : string
  // 图片连接
  imgUrl : string
  // 跳转类型
  type : number
}

/** 首页-前台类目数据类型 */
export type CategoryItem = {
  /** 图标路径 */
  icon: string
  /** id */
  id: string
  /** 分类名称 */
  name: string
}

/** 首页-热门推荐数据类型 */
export type HotItem = {
   /** 说明 */
   alt: string
   /** id */
   id: string
   /** 图片集合[ 图片路径 ] */
   pictures: string[]
   /** 跳转地址 */
   target: string
   /** 标题 */
   title: string
   /** 推荐类型 */
   type: string
}

/** 首页-猜你喜欢数据类型 */
export type GuessItem = {
  /** 商品描述 */
  desc: string
  /** 商品折扣 */
  discount: number
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品已下单数量 */
  orderNum: number
  /** 商品图片 */
  picture: string
  /** 商品价格 */
  price: number
}
