import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'

const pendingMap = new Map<string, Canceler>()
export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&')

export class HttpCanceler {
  /**
   * 添加一个请求
   */
  public addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPendingUrl(config)

    config.cancelToken
      = config.cancelToken
      ?? new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url))
          pendingMap.set(url, cancel)
      })
  }

  /**
   * 清理所有请求
   */
  public removeAllPending() {
    pendingMap.forEach(cancel => cancel?.())
    pendingMap.clear()
  }

  /**
   * 删除某个请求
   * @param {Object} config
   */
  public removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      pendingMap.get(url)?.(url)
      pendingMap.delete(url)
    }
  }

  /**
   * 重置，清空所有请求
   */
  public reset(): void {
    pendingMap.clear()
  }
}
