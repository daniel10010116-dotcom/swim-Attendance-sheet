/**
 * Vercel：明確處理 POST /api/auth/login，轉給 Express。
 */
import app from '../../server/app.js'

export default function handler(req, res) {
  req.url = '/api/auth/login'
  return app(req, res)
}
