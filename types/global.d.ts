import { GetApiData } from '@/api';

export {};

declare global {
  type Recordable<T = any> = Record<string, T>;
  type Nullable<T> = T | null;
  type CurrencyT = NonNullable<GetApiData<typeof apis.currencyChain>[0]['currency']>[0];

  // 环境变量
  interface Env {
    /** 代理请求 */
    NUXT_PROXY: [string, string][];
  }

  // 定义 import.meta 的类型
  interface ImportMeta {}
}

// 定义 nuxt.config.ts 中 appConfig 的类型, 使用 useAppConfig 获取 appConfig 的值
declare module 'nuxt/schema' {
  interface AppConfigInput {
    /** Theme configuration */
    theme?: {
      /** Primary app color */
      primaryColor?: string;
    };
  }
}
