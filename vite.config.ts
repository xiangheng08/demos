import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { demos, demosBuild } from './plugins/demos'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), demos(), demosBuild()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
