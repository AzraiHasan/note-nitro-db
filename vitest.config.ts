// vitest.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
})
