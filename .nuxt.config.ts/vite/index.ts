
import { NuxtConfig } from 'nuxt/config';
import { resolve } from 'path';



import { env } from '../utils';
import { createProxy  } from './proxy';

export const defineConfig = (): NuxtConfig['vite'] => {
  return {
    envDir: env.dir,
    plugins: [
  
    ],
    optimizeDeps: {
    
    },
  };
};



