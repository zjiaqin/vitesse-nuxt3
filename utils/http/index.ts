import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isAxiosError } from 'axios'

import clone from 'lodash-es/clone'
import isString from 'lodash-es/isString'
import merge from 'lodash-es/merge'

import { ECode } from './constants'
import { Http } from './Http'
import { HttpError } from './HttpError'
import type { CreateHttpOptions, HttpTransform, RequestOptions } from './type'
import { joinTimestamp } from './utils'
import type { ApiResult, GetApiResult } from '@/api/type'

const transform: HttpTransform = {
  /** 请求之前处理 config */
  beforeRequestHook: (config, options) => {
    const { joinTime = true } = options
    const params = config.params || {}
    const data = config.data || false

    if (config.method?.toUpperCase() === 'GET') {
      if (isString(params)) {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
      else {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      }
    }
    else {
      if (isString(params)) {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
      else {
        if (
          Reflect.has(config, 'data')
          && config.data
          && (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        }
        else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
      }
    }

    return config
  },

  /** 请求拦截器处理 */
  requestInterceptors: (config, options) => {
    (config.headers as Recordable).lang = 'zh-CN'

    return config
  },

  /** 响应拦截器处理 */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /** 错误拦截器处理 */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: AxiosError) => {
    throw error
  },

  /** 处理响应数据 */
  transformResponseHook: (res: AxiosResponse<ApiResult>, options: RequestOptions) => {
    if (options.isReturnNativeResponse)
      return res

    const apiRes = res?.data ?? {}
    let { data } = apiRes
    const { code = -1, pagination } = apiRes
    const isSuccess = code === ECode.SUCCESS

    if (isSuccess) {
      if (pagination) {
        data ??= []
        data._pagination = pagination
        Object.defineProperty(data, '_pagination', {
          enumerable: false,
          writable: false,
        })
      }

      return data
    }

    throw res
  },

  /** 响应错误处理 */
  requestCatchHook: (err, options) => {
    const { errorMessageMode } = options
    const defaultMsg = 'Request failure'
    let apiError = new HttpError({ code: -1, msg: defaultMsg, data: null })

    if (isAxiosError(err)) {
      // axios 抛出的错误，包含 HTTP 错误
      apiError = new HttpError({
        code: err.response?.status ?? -1,
        msg: err.response?.statusText ?? err?.message ?? `${defaultMsg}(1)`,
        data: null,
      })
    }
    else if (err instanceof Error) {
      // 所有 Error 对象的错误
      apiError = new HttpError({ code: -1, msg: `${err.message}(2)`, data: null })
    }
    else {
      // 业务的错误，既code非0的情况
      apiError = new HttpError({
        code: err?.data?.code ?? -1,
        msg: err?.data?.msg ?? `${defaultMsg}(3)`,
        data: err?.data?.data,
      })
    }

    // 对指定 code 进行统一处理
    // switch(apiError.code) {}

    if (errorMessageMode === 'message')
      discrete.message?.error(apiError.message)

    return apiError
  },
}

function createHttp(options?: Partial<CreateHttpOptions>) {
  return new Http(
    merge(
      {
        timeout: 10 * 1000,
        transform: clone(transform),
        headers: {},
        requestOptions: {
          isReturnNativeResponse: false,
          errorMessageMode: 'message',
          apiUrl: '',
          joinTime: true,
          withToken: true,
        },
      },
      options || {},
    ),
  )
}

export const defHttp = createHttp({ baseURL: '/v1' })
export function createRequest<TReq, TResp = any>(name: string,
  requestConfigCreator: (args: TReq) => AxiosRequestConfig) {
  const request = function (args: TReq, options?: RequestOptions) {
    type Res = GetApiResult<TResp>
    type PResp = Promise<Res>

    const pResp = defHttp.request<Res>(requestConfigCreator(args), options)
    const either = async function (this: PResp) {
      const resp = await this.then(res => res).catch(err => err)
      const ret = HttpError.is(resp) ? [resp, null] : [null, resp]

      return ret as [HttpError<Res> | null, Res | null]
    }

    return Object.assign(pResp, { either }) as PResp & {
      /**
       * 将错误与数据一起返回
       *
       * @returns [httpError, data]
       */
      either: typeof either
    }
  }
  request.id = name

  return request
}
