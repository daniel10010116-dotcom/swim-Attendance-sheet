/**
 * Vercel：由 vercel.json rewrite 將 /api/* 轉到此檔，還原路徑後交給 Express。
 */
import app from '../server/app.js'

export default function handler(req, res) {
  const base = 'http://x'
  const path = (req.url && req.url.startsWith('/'))
    ? (() => {
        try {
          const q = new URL(req.url, base).searchParams.get('path')
          return q ? decodeURIComponent(q) : ''
        } catch {
          return ''
        }
      })()
    : ''
  req.url = '/api' + (path ? '/' + path : '')
  return app(req, res)
}
