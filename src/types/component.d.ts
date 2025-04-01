/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    XtxSwriper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
  }
}

import XtxGuess from '@/components/XtxGuess.vue'
import XtxSwiper from '@/components/XtxSwiper .vue'
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
