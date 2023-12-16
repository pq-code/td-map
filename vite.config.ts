import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    // port: "7000",//端口
    host: '0.0.0.0',
    open: false,//服务启动时自动在浏览器中打开应用
    // 反向代理配置
    proxy: { //配置多个代理
      '/api/upload': {
        target: "http://127.0.0.1:6666",
        changeOrigin: true, ///设置访问目标地址允许跨域
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      // '/image': {
      //   target: "http://127.0.0.1:3005/",
      //   changeOrigin: true, ///设置访问目标地址允许跨域
      //   rewrite: (p) => p.replace(/^\/image/, '')
      // },
      // '/api/canvas': {
      //   target: "http://127.0.0.1:3005/",
      //   changeOrigin: true, ///设置访问目标地址允许跨域
      //   rewrite: (p) => p.replace(/^\/api/, '')
      // },
      // '/prod-api': {
      //     target: "https://xxxx.com/",
      //     changeOrigin: true,///设置访问目标地址允许跨域
      //     rewrite: (p) => p.replace(/^\/prod-api/, '')
      // },
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always', // 括号内才使用数学计算
        globalVars: {
          // 全局变量
          mainColor: 'red'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
