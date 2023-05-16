import { NuxtConfig } from 'nuxt/config';

export const defineConfig = (): NuxtConfig['i18n'] => {
  return {
    baseUrl: 'https://my-nuxt-app.com',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_and_default',
    lazy: true,
    langDir: 'lang',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root',
    },
    vueI18n: {
      legacy: false,
      locale: 'zh',
      // messages: {},
      fallbackLocale: 'zh',
    },
  };
};
