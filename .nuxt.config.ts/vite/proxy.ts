import type { ProxyOptions } from 'vite';

export function createProxy(list: Env['NUXT_PROXY']) {
  const ret: Record<string, ProxyOptions> = {};

  for (const [prefix, target] of list ?? []) {
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
    };
  }

  return ret;
}
