import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 使用相對路徑，部署到 GitHub Pages 任意 repo 路徑皆可正常載入
  base: './',
})
