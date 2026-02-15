import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 預設 /（Vercel、本機皆可）；部署到 GitHub Pages 時設 VITE_BASE_PATH=/你的repo名/
  base: process.env.VITE_BASE_PATH || '/',
})
