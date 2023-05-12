import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ApiResult } from '@/api/type';

export interface CreateHttpOptions extends InternalAxiosRequestConfig {
  transform?: HttpTransform;
  requestOptions?: RequestOptions;
}

export interface HttpTransform {
  /**
   * @description: 在请求前处理配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 在响应数据后处理
   */
  transformResponseHook?: (res: AxiosResponse<ApiResult>, options: RequestOptions) => any;

  /**
   * @description: 在请求失败后处理
   */
  requestCatchHook?: (err: Error | AxiosResponse<ApiResult> | AxiosResponse<ApiResult>, options: RequestOptions) => any;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig, options: CreateHttpOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: AxiosError) => void;
}

export interface RequestOptions {
  /** URL 中加入时间戳 */
  joinTime?: boolean;
  /** 携带 Token */
  withToken?: boolean;
  /** 返回原生响应数据，包含 Header */
  isReturnNativeResponse?: boolean;
  /** 错误消息提示类型 */
  errorMessageMode?: ErrorMessageMode;
}

export type ErrorMessageMode = 'none' | 'message';
