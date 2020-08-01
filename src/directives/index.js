import Vue from "vue";
import { scrollLoadBigData, findScrollContainer } from "./scroll-load";

Vue.directive('scroll-load', {
  bind(el, binding) {
    /** binding.value
     * {
     *    data:（必须）数据;
     *    size:（必须）分片大小;
     *    onChange: （必须）触发加载后监听数据更新;
     *    distance: 触发加载的距离阈值，单位为px;
     *    delay: 节流时延，单位为ms;
     *    immediate: 是否立即执行加载方法，以防初始状态下内容无法撑满容器;
     *    target:（css选择器）显式指定一个滚动容器，该容器必须为绑定该指令的后代节点;
     * }
     */
    const { data, size, onChange, target, ...restConfig } = binding.value
    if (!Array.isArray(data)) {
      throw new TypeError('v-scroll-load: params data is not a Array!')
    }
    if (typeof size !== 'number') {
      throw new TypeError('v-scroll-load: size is not a number!')
    }
    if (typeof onChange !== 'function') {
      throw new TypeError('v-scroll-load: onChange is not a function!')
    }
    Vue.nextTick(() => {
      let container = target ? el.querySelector(target) : findScrollContainer(el)
      if (!container) {
        throw new Error(`can not find the target by css selector: ${target}`)
      }
      el.$loader = scrollLoadBigData(container, data, {
        size,
        onChange,
        ...restConfig
      })
    })
  },
  update(el, binding) {
    if (el.$loader) {
      const { data, size } = binding.value
      el.$loader.update(data, size)
    }
  }
})
