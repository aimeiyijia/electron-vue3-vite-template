import { rmSync } from 'node:fs'

import vue from '@vitejs/plugin-vue'
import AutoImportTypes from 'auto-import-types'
import { resolve } from 'path'
import PiniaAutoRefs from 'pinia-auto-refs'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import commonjs from 'vite-plugin-commonjs'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    css: {
      preprocessorOptions: {
        scss: {
          // 全局添加scss变量用
          // additionalData: '@import "@/styles/base.scss";'
        }
      },
      modules: {}
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
              }
            }
          }
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
              }
            }
          }
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
      commonjs(),
      AutoImportTypes({
        dtsDir: 'types'
      }),
      PiniaAutoRefs(),
      AutoImport({
        dts: 'types/auto-imports.d.ts', // 可以自定义文件生成的位置，默认是根目录下
        imports: [
          'vue',
          'pinia',
          {
            '@/helper/pinia-auto-refs': ['useStore']
          }
        ],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: 'readonly' // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        // 指定组件位置，默认是src/components
        dirs: ['src/components'],
        // ui库解析器
        resolvers: [ElementPlusResolver()],
        extensions: ['vue'],
        // 配置文件生成位置
        dts: 'types/components.d.ts'
      }),
      Unocss()
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(import.meta.env.VITE_BASE_URL)
        return {
          host: url.hostname,
          port: +url.port
        }
      })(),
    clearScreen: false
  }
})
