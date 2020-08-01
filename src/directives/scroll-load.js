import throttle from 'lodash/throttle'

/**
 * 滚动加载数据
 * @param {HTMLElement} container 滚动容器
 * @param {Function} loader 加载数据的方法
 * @param {{ distance: number; delay: number; immediate: boolean; }} config { distance: 触发加载的距离阈值，单位为px, delay: 节流时延，单位为ms, immediate: 是否立即执行加载方法，以防初始状态下内容无法撑满容器。 }
 */
export function scrollLoad(container, loader, config) {
  config = {
    delay: 100,
    distance: 0,
    immediate: true,
    ...config
  }
  if (config.immediate) {
    loader()
  }
  container.addEventListener(
    'scroll',
    throttle(() => {
      if (checkScrollEnd(container, config.distance)) {
        loader()
      }
    }, config.delay)
  )
}

function checkScrollEnd(
  { scrollHeight, scrollTop, clientHeight },
  distance = 0
) {
  return scrollHeight - scrollTop <= clientHeight + distance
}

function isScrollContainer(container) {
  return /(auto|scroll)/.test(window.getComputedStyle(container).overflowY)
}

export function findScrollContainer(target) {
  while (target) {
    if (isScrollContainer(target)) {
      return target
    }
    target = target.parentElement
  }
  return window
}

function chunk(bigData, size, n) {
  return bigData.slice(size * n, size * (n + 1))
}

/**
 * 分割大数据，分批加载，分批渲染
 * @param {HTMLElement} container 滚动容器
 * @param {any[]} bigData 大数据集
 * @param {{ size: number; onChange: (data: any[]) => any; distance: number; delay: number; immediate: boolean; }} config { size: 分片大小; onChange: 触发加载后监听数据更新; distance: 触发加载的距离阈值，单位为px, delay: 节流时延，单位为ms, immediate: 是否立即执行加载方法，以防初始状态下内容无法撑满容器; }
 */
export function scrollLoadBigData(container, bigData, config) {
  let { size, onChange, ...restConfig } = config
  let data = []
  let n = 0
  let result = {
    completed: false,
    /**
     * 更新方法
     * @param {any[]} newData 新数据
     * @param {number} newSize 新size
     */
    update: (newData, newSize = size) => {
      if (bigData === newData) {
        return
      }
      result.completed = false
      bigData = newData
      size = newSize
      n = 0
      data = chunk(newData, size, n)
      onChange([...data])
      n++
    }
  }
  scrollLoad(
    container,
    () => {
      if (size * n >= bigData.length) {
        result.completed = true

        return
      }
      data.push(...chunk(bigData, size, n))
      onChange([...data])
      n++
    },
    restConfig
  )

  return result
}
