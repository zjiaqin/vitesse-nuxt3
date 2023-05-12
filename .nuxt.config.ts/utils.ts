import { resolve } from 'path';
import { loadEnv } from 'vite';

export function envParse<T extends Recordable>(env: Recordable | string): T {
  return JSON.parse(typeof env === 'string' ? env : JSON.stringify(env), (_, value) => {
    if (typeof value !== 'string') return value;

    if (/(\[.*\])|(\{.*\})/.test(value)) return envParse(value);
    if (value === 'false') return false;
    if (value === 'true') return true;

    return value;
  });
}

/**
 * 环境变量
 */
export const env = (() => {
  const mode = process.env.NODE_ENV as 'development' | 'production';
  const envDir = resolve(process.cwd(), './envs');
  const envVar = envParse<Env>(loadEnv(mode, envDir, 'NUXT'));

  return {
    dir: envDir,
    mode,
    var: envVar,
    get isDev() {
      return this.mode === 'development';
    },
    get isPro() {
      return this.mode === 'production';
    },
  };
})();
