export function filterBigData(bigData, handler) {
  let timeoutId = null
  let errorHandler
  const future = new Promise((resolve, reject) => {
    const data = []
    let n = 0
    let chunk
    const run = () => {
      timeoutId = setTimeout(() => {
        chunk = rangeFilter(bigData, 5000, n, handler)
        if (chunk) {
          data.push(...chunk)
          n++
          run()
        } else {
          resolve(data)
        }
      }, 16)
    }
    run()
    errorHandler = reject
  })
  return {
    future,
    cancel() {
      clearTimeout(timeoutId)
      errorHandler('filter is canceled!')
    }
  }
}

export function rangeEach(data, size, n, handler) {
  const len = data.length
  let i = n * size
  if (i >= len) {
    return true
  }
  let end = (n + 1) * size
  end = end > len ? len : end
  while (i < end) {
    handler(data[i++])
  }
  return false
}

export function rangeFilter(data, size, n, handler) {
  const result = []
  const completed = rangeEach(data, size, n, item => {
    if (handler(item)) {
      result.push(item)
    }
  })
  if (completed) {
    return
  }
  return result
}

export function eachBigData(bigData, handler, _result) {
  let timeoutId = null
  let errorHandler
  const future = new Promise((resolve, reject) => {
    let n = 0
    let completed
    const run = () => {
      setTimeout(() => {
        completed = rangeEach(bigData, 5000, n, item => {
          handler(item)
        })
        if (!completed) {
          n++
          run()
        } else {
          resolve(_result)
        }
      }, 16)
    }
    run()
    errorHandler = reject
  })

  return {
    future,
    cancel() {
      clearTimeout(timeoutId)
      errorHandler('eachBigData is canceled!')
    }
  }
}

export function mapBigData(bigData, handler) {
  const data = []
  return eachBigData(
    bigData,
    item => {
      data.push(...handler(item))
    },
    data
  )
}

/**
 * @param {string} template 模版字符串
 * @param {object} data 模版字符串
 * 类似 'hello {name}'
 */
export function compileStringTemplate(template, data) {
  return template.replace(/(\{[^{}]+\})/g, (_, p) => {
    return data[p.slice(1, -1)]
  })
}
