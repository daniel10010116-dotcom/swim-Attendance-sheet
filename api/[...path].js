/**
 * Vercel Serverless：將 /api/* 請求轉給 Express app。
 * 部署時請在 Vercel 設定 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY、JWT_SECRET。
 */
import app from '../server/app.js'

export default function handler(req, res) {
  // Vercel 有時傳入的 req.url 沒有 /api 前綴，確保 Express 能對應到 /api/* 路由
  const path = req.url || '/'
  if (!path.startsWith('/api')) {
    req.url = '/api' + (path.startsWith('/') ? path : '/' + path)
  }
  return app(req, res)
}
