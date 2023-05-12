import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import cloneDeep from 'lodash-es/cloneDeep'

import type { CreateHttpOptions, RequestOptions } from './type'
import type { ApiResult } from '@/api/type'

export class Http {
  private axiosInstance: AxiosInstance

  public constructor(private readonly options: CreateHttpOptions) {
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  public get axios() {
    return this.axiosInstance
  }

  public get transform() {
    return this.options.transform
  }

  public configAxios(config: CreateHttpOptions) {
    this.axiosInstance = axios.create(config)
  }

  public setHeader(headers: Recordable) {
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  public request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf = cloneDeep(config)
    const opt: RequestOptions = { ...this.options.requestOptions, ...options }
    const { beforeRequestHook, requestCatchHook, transformResponseHook } = this.transform || {}

    if (beforeRequestHook)
      conf = beforeRequestHook(conf, opt)

    return new Promise((resolve, reject) => {
      // 避免在SSR打包时发送真实请求
      if (import.meta.env.SSR) {
        resolve(undefined as any)
        return
      }

      this.axiosInstance
        .request<any, AxiosResponse<ApiResult>>(conf)
        .then((res: AxiosResponse<ApiResult>) => {
          if (transformResponseHook) {
            try {
              resolve(transformResponseHook(res, opt))
            }
            catch (err) {
              throw err || new Error('request error!')
            }
          }
          else {
            resolve((res as unknown) as Promise<T>)
          }
        })
        .catch((err: AxiosError) => {
          if (requestCatchHook) {
            reject(requestCatchHook(err, opt))

            return
          }

          reject(err)
        })
    })
  }

  private setupInterceptors() {
    if (!this.transform)
      return

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = this.transform

    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use((config: CreateHttpOptions) => {
      if (requestInterceptors)

        config = requestInterceptors(config, this.options)

      return config
    }, undefined)

    // 请求拦截器错误捕获
    if (requestInterceptorsCatch)
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      if (responseInterceptors)

        res = responseInterceptors(res)

      return res
    }, undefined)

    // 响应结果拦截器错误捕获
    if (responseInterceptorsCatch) {
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(this.axiosInstance, error)
      })
    }
  }
}
