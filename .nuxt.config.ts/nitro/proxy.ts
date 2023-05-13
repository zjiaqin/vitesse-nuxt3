import type { ProxyOptions } from 'vite';


export function createDevProxy(list: Env['NUXT_PROXY']) {
  const ret: Record<string, ProxyOptions> = {};

  for (const [prefix, target] of list ?? []) {
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      prependPath: true,
    };
  }

  return ret;
}