
import { NuxtConfig } from 'nuxt/config';
import { env } from '../utils';
import {   createDevProxy} from './proxy';


export const defineConfig = (): NuxtConfig['nitro'] =>{
  return {
    devProxy: createDevProxy(env.var.NUXT_PROXY),
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
    
  }
  
}

